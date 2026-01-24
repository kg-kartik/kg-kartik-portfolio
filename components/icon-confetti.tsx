"use client"

import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"

interface AnimatedIconProps {
  icon: LucideIcon
  iconColor?: string
  bgColor?: string
}

export function IconConfetti({ 
  icon: Icon, 
  iconColor = "text-purple-500",
  bgColor = "bg-purple-50 dark:bg-purple-900/20",
}: AnimatedIconProps) {
  return (
    <motion.div
      className={`w-12 h-12 rounded-full ${bgColor} flex items-center justify-center flex-shrink-0`}
      whileHover={{ 
        scale: 1.15,
        rotate: [0, -5, 5, -5, 0],
        transition: { duration: 0.4 }
      }}
      animate={{
        y: [0, -2, 0],
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
      <Icon className={`w-6 h-6 ${iconColor}`} />
    </motion.div>
  )
}
