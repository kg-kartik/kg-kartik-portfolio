"use client"

import type React from "react"

import { useState } from "react"
import confetti from "canvas-confetti"

interface ConfettiButtonProps {
  children: React.ReactNode
}

export function ConfettiButton({ children }: ConfettiButtonProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  const handleClick = () => {
    setIsAnimating(true)

    // Fire confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    })

    // Reset animation state after animation completes
    setTimeout(() => {
      setIsAnimating(false)
    }, 1000)
  }

  return (
    <div onClick={handleClick} className={`cursor-pointer transition-transform ${isAnimating ? "scale-105" : ""}`}>
      {children}
    </div>
  )
}
