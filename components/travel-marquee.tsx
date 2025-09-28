"use client"

import { useRef, useEffect } from "react"
import { motion, useAnimation } from "framer-motion"
import { useInView } from "react-intersection-observer"
import Image from "next/image"
import { Plane } from "lucide-react"

interface TravelImage {
  id: number
  src: string
  location: string
  date: string
}

const travelImages: TravelImage[] = [
  {
    id: 1,
    src: "/placeholder.svg?height=400&width=300",
    location: "Avo Connect Delhi",
    date: "2024",
  },
  {
    id: 2,
    src: "/placeholder.svg?height=400&width=300",
    location: "Team Dinner",
    date: "2023",
  },
  {
    id: 3,
    src: "/placeholder.svg?height=400&width=300",
    location: "Solana Breakpoint - Singapore",
    date: "2024",
  },
  {
    id: 4,
    src: "/placeholder.svg?height=400&width=300",
    location: "Kyoto, Japan",
    date: "Spring 2024",
  },
  {
    id: 5,
    src: "/placeholder.svg?height=400&width=300",
    location: "Banff, Canada",
    date: "Fall 2023",
  },
  {
    id: 6,
    src: "/placeholder.svg?height=400&width=300",
    location: "Marrakech, Morocco",
    date: "Winter 2023",
  },
]

export function TravelMarquee() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  })

  const controls = useAnimation()

  useEffect(() => {
    if (inView) {
      controls.start("visible")
    } else {
      controls.start("hidden")
    }
  }, [controls, inView])

  return (
    <div ref={ref} className="relative overflow-hidden py-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={controls}
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 },
        }}
        transition={{ duration: 0.6 }}
        className="flex items-center gap-2 mb-6"
      >
        <h3 className="text-xl font-medium">Places I've Been</h3>
        <motion.div
          animate={{
            y: [0, -5, 0],
            rotate: [0, -10, 0, 10, 0],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
          }}
        >
          <Plane className="w-5 h-5 text-blue-500" />
        </motion.div>
      </motion.div>

      <div className="relative" ref={containerRef}>
        <div className="flex overflow-hidden gap-4">
          <motion.div
            className="flex gap-4 min-w-max"
            animate={{
              x: [0, -1920],
            }}
            transition={{
              x: {
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
                duration: 30,
                ease: "linear",
              },
            }}
          >
            {travelImages.map((image) => (
              <TravelCard key={image.id} image={image} />
            ))}
            {travelImages.map((image) => (
              <TravelCard key={`dup-${image.id}`} image={image} />
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

function TravelCard({ image }: { image: TravelImage }) {
  return (
    <motion.div
      className="relative flex-shrink-0 rounded-xl overflow-hidden group"
      style={{ width: "280px", height: "380px" }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Image
        src={image.src || "/placeholder.svg"}
        alt={image.location}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        <h4 className="font-medium text-lg">{image.location}</h4>
        <p className="text-sm text-white/80">{image.date}</p>
      </div>
    </motion.div>
  )
}
