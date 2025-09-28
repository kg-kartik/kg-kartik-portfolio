import { type NextRequest, NextResponse } from "next/server"

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for")
  const realIP = request.headers.get("x-real-ip")

  if (forwarded) {
    return forwarded.split(",")[0].trim()
  }

  if (realIP) {
    return realIP
  }

  return request.ip || "unknown"
}

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
      return NextResponse.json({ likes: 0 })
    }

    const { Redis } = await import("@upstash/redis")

    const redis = new Redis({
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN,
    })

    const likes = await redis.get(`likes:${params.slug}`).catch(() => 0)
    return NextResponse.json({ likes: Number(likes) || 0 })
  } catch (error) {
    console.error("Error fetching likes:", error)
    return NextResponse.json({ likes: 0 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
      return NextResponse.json({ error: "Database not available" }, { status: 503 })
    }

    const { Redis } = await import("@upstash/redis")

    const redis = new Redis({
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN,
    })

    // Parse request body with error handling
    let body
    try {
      body = await request.json()
    } catch (parseError) {
      return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 })
    }

    const { action } = body

    if (!action || (action !== "like" && action !== "unlike")) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    const clientIP = getClientIP(request)
    const likeKey = `likes:${params.slug}`
    const userLikeKey = `user_like:${params.slug}:${clientIP}`

    // Check if user has already liked this post
    const hasLiked = await redis.get(userLikeKey).catch(() => null)

    if (action === "like") {
      if (hasLiked) {
        return NextResponse.json({ error: "Already liked" }, { status: 400 })
      }

      // Increment likes and mark user as having liked
      const newLikes = await redis.incr(likeKey).catch(async () => {
        await redis.set(likeKey, 1)
        return 1
      })

      await redis.set(userLikeKey, "1", { ex: 60 * 60 * 24 * 30 }).catch(() => {})

      return NextResponse.json({ likes: newLikes, liked: true })
    } else if (action === "unlike") {
      if (!hasLiked) {
        return NextResponse.json({ error: "Not liked yet" }, { status: 400 })
      }

      // Decrement likes and remove user's like record
      const currentLikes = await redis.get(likeKey).catch(() => 0)
      const newLikes = Math.max(0, Number(currentLikes) - 1)
      await redis.set(likeKey, newLikes).catch(() => {})
      await redis.del(userLikeKey).catch(() => {})

      return NextResponse.json({ likes: newLikes, liked: false })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Error updating likes:", error)
    return NextResponse.json({ error: "Failed to update likes" }, { status: 500 })
  }
}
