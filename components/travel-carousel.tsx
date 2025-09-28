"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, MapPin, Calendar } from "lucide-react"
import Image from "next/image"

interface TravelImage {
  id: number
  src: string
  location: string
  date: string
  description: string
}

const travelImages: TravelImage[] = [
  {
    id: 1,
    src: "/placeholder.svg?height=400&width=600",
    location: "Santorini, Greece",
    date: "Summer 2024",
    description: "Watching the sunset over the Aegean Sea",
  },
  {
    id: 2,
    src: "/placeholder.svg?height=400&width=600",
    location: "Kyoto, Japan",
    date: "Spring 2024",
    description: "Cherry blossoms in full bloom at Kiyomizu-dera",
  },
  {
    id: 3,
    src: "/placeholder.svg?height=400&width=600",
    location: "Banff, Canada",
    date: "Fall 2023",
    description: "Pristine mountain lakes and autumn colors",
  },
  {
    id: 4,
    src: "/placeholder.svg?height=400&width=600",
    location: "Marrakech, Morocco",
    date: "Winter 2023",
    description: "Vibrant souks and traditional architecture",
  },
  {
    id: 5,
    src: "/placeholder.svg?height=400&width=600",
    location: "Reykjavik, Iceland",
    date: "Winter 2022",
    description: "Northern lights dancing across the sky",
  },
]

export function TravelCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [direction, setDirection] = useState(0)

  const nextSlide = useCallback(() => {
    setDirection(1)
    setCurrentIndex((prevIndex) => (prevIndex + 1) % travelImages.length)
  }, [])

  const prevSlide = useCallback(() => {
    setDirection(-1)
    setCurrentIndex((prevIndex) => (prevIndex - 1 + travelImages.length) % travelImages.length)
  }, [])

  const goToSlide = useCallback(
    (index: number) => {
      setDirection(index > currentIndex ? 1 : -1)
      setCurrentIndex(index)
    },
    [currentIndex],
  )

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(nextSlide, 4000)
    return () => clearInterval(interval)
  }, [isAutoPlaying, nextSlide])

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
    }),
  }

  const swipeConfidenceThreshold = 10000
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity
  }

  return (
    <div className="relative w-full max-w-6xl mx-auto">
      <motion.div
        className="relative h-[500px] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900"
        onHoverStart={() => setIsAutoPlaying(false)}
        onHoverEnd={() => setIsAutoPlaying(true)}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
              scale: { duration: 0.4 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x)

              if (swipe < -swipeConfidenceThreshold) {
                nextSlide()
              } else if (swipe > swipeConfidenceThreshold) {
                prevSlide()
              }
            }}
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
          >
            <div className="relative w-full h-full">
              <Image
                src={travelImages[currentIndex].src || "/placeholder.svg"}
                alt={travelImages[currentIndex].location}
                fill
                className="object-cover"
                priority
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Content overlay */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="absolute bottom-0 left-0 right-0 p-8 text-white"
              >
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm font-medium">{travelImages[currentIndex].location}</span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm opacity-80">{travelImages[currentIndex].date}</span>
                </div>
                <p className="text-lg font-medium max-w-md">{travelImages[currentIndex].description}</p>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons */}
        <motion.button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-colors z-10"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Previous image"
        >
          <ChevronLeft className="w-6 h-6" />
        </motion.button>

        <motion.button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-colors z-10"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Next image"
        >
          <ChevronRight className="w-6 h-6" />
        </motion.button>

        {/* Auto-play indicator */}
        <motion.div
          className="absolute top-4 right-4 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className={`w-3 h-3 rounded-full ${isAutoPlaying ? "bg-green-400" : "bg-gray-400"} transition-colors`} />
        </motion.div>
      </motion.div>

      {/* Dots indicator */}
      <div className="flex justify-center gap-2 mt-6">
        {travelImages.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentIndex
                ? "bg-blue-500"
                : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Thumbnail preview */}
      <motion.div
        className="flex justify-center gap-4 mt-6 overflow-x-auto pb-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        {travelImages.map((image, index) => (
          <motion.button
            key={image.id}
            onClick={() => goToSlide(index)}
            className={`relative flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
              index === currentIndex
                ? "border-blue-500 scale-110"
                : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
            }`}
            whileHover={{ scale: index === currentIndex ? 1.1 : 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Image src={image.src || "/placeholder.svg"} alt={image.location} fill className="object-cover" />
            {index !== currentIndex && <div className="absolute inset-0 bg-black/30" />}
          </motion.button>
        ))}
      </motion.div>
    </div>
  )
}
