import { type NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"

function getClientIP(): string {
  const headersList = headers()
  const forwarded = headersList.get("x-forwarded-for")
  const realIP = headersList.get("x-real-ip")
  const cfConnectingIP = headersList.get("cf-connecting-ip") // Cloudflare

  if (forwarded) {
    return forwarded.split(",")[0].trim()
  }

  if (realIP) {
    return realIP
  }

  if (cfConnectingIP) {
    return cfConnectingIP
  }

  return "unknown"
}

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    // Check if Redis environment variables are available
    if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
      console.warn("Redis environment variables not found, using fallback")
      return NextResponse.json({
        likes: 0,
        liked: false,
      })
    }

    const { Redis } = await import("@upstash/redis")

    const redis = new Redis({
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN,
    })

    const clientIP = getClientIP()
    const userLikeKey = `user_like:${params.slug}:${clientIP}`
    const likeKey = `likes:${params.slug}`

    const [hasLiked, likes] = await Promise.all([
      redis.get(userLikeKey).catch(() => null),
      redis.get(likeKey).catch(() => 0),
    ])

    return NextResponse.json({
      likes: Number(likes) || 0,
      liked: Boolean(hasLiked),
    })
  } catch (error) {
    console.error("Error fetching like status:", error)
    // Always return valid JSON with default values
    return NextResponse.json({
      likes: 0,
      liked: false,
    })
  }
}
