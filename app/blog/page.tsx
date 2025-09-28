"use client"

import Link from "next/link"
import { ArrowUpRight, ArrowLeft } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { motion } from "framer-motion"
import { StaggeredChildren } from "@/components/animations"
import { ScrollProgress } from "@/components/scroll-progress"
import { PersistentLikeButton } from "@/components/persistent-like-button"

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 dark:text-white transition-colors duration-300">
      <ScrollProgress />
      <header className="border-b border-gray-100 dark:border-gray-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="text-xl font-medium"
            >
              Kartik Goel
            </motion.h1>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-blue-500 hover:text-blue-700 transition-colors flex items-center">
                <ArrowLeft className="mr-1 w-4 h-4" /> Back to home
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 max-w-3xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-bold mb-8 border-b border-gray-100 dark:border-gray-800 pb-2"
        >
          blog
        </motion.h2>

        <StaggeredChildren staggerDelay={0.15} containerDelay={0.2} className="space-y-6">
          <article>
            <Link href="/blog/audio-seeking" className="block">
              <motion.div
                className="py-6 px-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors -mx-4"
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="text-2xl font-medium mb-3">🎧 How Audio Seeking Works in Streaming</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Have you ever listened to a song or podcast online, skipped to your favorite part, and it just worked
                  instantly? That magic moment is thanks to something happening under the hood: audio streaming with
                  range requests.
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">May 15, 2025</span>
                  <div className="flex items-center gap-4">
                    <PersistentLikeButton slug="audio-seeking" />
                    <span className="text-blue-500 flex items-center">
                      Read more <ArrowUpRight className="ml-1 w-4 h-4" />
                    </span>
                  </div>
                </div>
              </motion.div>
            </Link>
          </article>
        </StaggeredChildren>
      </main>
    </div>
  )
}
