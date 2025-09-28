"use client"

import { useState, useEffect } from "react"
import { Heart } from "lucide-react"

interface PersistentLikeButtonProps {
  slug: string
  className?: string
}

export function PersistentLikeButton({ slug, className = "" }: PersistentLikeButtonProps) {
  const [likes, setLikes] = useState(0)
  const [liked, setLiked] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  // Load initial likes count and user's like status
  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        const response = await fetch(`/api/likes/${slug}/status`)

        // Check if response is actually JSON
        const contentType = response.headers.get("content-type")
        if (!contentType || !contentType.includes("application/json")) {
          console.warn("API returned non-JSON response, using fallback")
          setLikes(0)
          setLiked(false)
          setError(false)
          return
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        setLikes(data.likes || 0)
        setLiked(data.liked || false)
        setError(false)
      } catch (error) {
        console.error("Error fetching like status:", error)
        // Use fallback values instead of showing error
        setLikes(0)
        setLiked(false)
        setError(false)
      }
    }

    fetchLikeStatus()
  }, [slug])

  const handleLike = async () => {
    if (loading) return

    setLoading(true)
    const action = liked ? "unlike" : "like"

    try {
      const response = await fetch(`/api/likes/${slug}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action }),
      })

      // Check if response is actually JSON
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        console.warn("API returned non-JSON response")
        return
      }

      let data
      try {
        data = await response.json()
      } catch (parseError) {
        console.error("Failed to parse JSON response:", parseError)
        return
      }

      if (!response.ok) {
        console.warn("API error:", data.error || `HTTP error! status: ${response.status}`)
        return
      }

      setLikes(data.likes || 0)
      setLiked(data.liked !== undefined ? data.liked : !liked)
      setError(false)
    } catch (error) {
      console.error("Error updating likes:", error)
      // Don't show error state, just keep current values
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className={`flex items-center gap-1.5 text-gray-500 hover:text-rose-500 transition-colors focus:outline-none disabled:opacity-50 ${className}`}
      aria-label={liked ? "Unlike" : "Like"}
    >
      <Heart
        className={`w-5 h-5 transition-all ${
          liked ? "fill-rose-500 text-rose-500" : ""
        } ${loading ? "animate-pulse" : ""}`}
      />
      <span className={`${liked ? "text-rose-500" : ""}`}>{loading ? "..." : likes}</span>
    </button>
  )
}
