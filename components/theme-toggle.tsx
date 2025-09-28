"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-10 h-10"></div>
  }

  const isDark = theme === "dark"

  return (
    <motion.button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 transition-colors relative overflow-hidden"
      whileTap={{ scale: 0.95 }}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <motion.div
        initial={false}
        animate={{
          scale: isDark ? 1 : 0,
          opacity: isDark ? 1 : 0,
          y: isDark ? 0 : 20,
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="absolute"
      >
        <motion.span className="text-xl" role="img" aria-label="Moon">
          🌙
        </motion.span>
      </motion.div>

      <motion.div
        initial={false}
        animate={{
          scale: isDark ? 0 : 1,
          opacity: isDark ? 0 : 1,
          y: isDark ? -20 : 0,
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="absolute"
      >
        <motion.span className="text-xl" role="img" aria-label="Sun">
          ☀️
        </motion.span>
      </motion.div>
    </motion.button>
  )
}
