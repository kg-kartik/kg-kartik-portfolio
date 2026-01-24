"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import Image from "next/image"

const travelImages = [
  "/images/travel-1.png",
  "/images/travel-2.png",
  "/images/travel-3.png",
  "/images/travel-4.png",
  "/images/travel-6.png",
]

export function TravelMarquee() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { ref } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  })

  return (
    <div ref={ref} className="relative overflow-hidden py-4">
      <div className="relative" ref={containerRef}>
        <div className="flex overflow-hidden gap-4">
          <motion.div
            className="flex gap-4 min-w-max"
            animate={{
              x: [0, -1420],
            }}
            transition={{
              x: {
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
                duration: 22,
                ease: "linear",
              },
            }}
          >
            {travelImages.map((src, index) => (
              <TravelCard key={index} src={src} />
            ))}
            {travelImages.map((src, index) => (
              <TravelCard key={`dup-${index}`} src={src} />
            ))}
          </motion.div>
        </div>

        {/* Gradient overlays for smooth edges */}
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white dark:from-gray-900 to-transparent z-10"></div>
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white dark:from-gray-900 to-transparent z-10"></div>
      </div>
    </div>
  )
}

function TravelCard({ src }: { src: string }) {
  return (
    <motion.div
      className="relative flex-shrink-0 rounded-xl overflow-hidden group"
      style={{ width: "280px", height: "380px" }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Image
        src={src}
        alt="Travel"
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-110"
      />
    </motion.div>
  )
}
