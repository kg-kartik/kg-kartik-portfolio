"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import confetti from "canvas-confetti"

interface TrophyConfettiProps {
  color?: string
}

export function TrophyConfetti({ color = "text-amber-500" }: TrophyConfettiProps) {
  const trophyRef = useRef<HTMLDivElement>(null)

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent parent ConfettiButton from firing
    
    if (trophyRef.current) {
      const rect = trophyRef.current.getBoundingClientRect()
      const x = (rect.left + rect.width / 2) / window.innerWidth
      const y = (rect.top + rect.height / 2) / window.innerHeight

      // Burst confetti from trophy position
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { x, y },
        colors: ['#FFD700', '#FFA500', '#FF6347', '#FFB347', '#FFDF00'],
        ticks: 200,
        gravity: 1.2,
        scalar: 0.9,
      })
    }
  }

  return (
    <motion.div
      ref={trophyRef}
      className={`text-2xl ${color} mt-1 cursor-pointer select-none`}
      onClick={handleClick}
      whileHover={{ 
        scale: 1.3,
        rotate: [0, -10, 10, -10, 0],
        transition: { duration: 0.5 }
      }}
      whileTap={{ scale: 0.9 }}
      animate={{
        y: [0, -3, 0],
      }}
      transition={{
        y: {
          duration: 2,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut",
        }
      }}
    >
      🏆
    </motion.div>
  )
}
