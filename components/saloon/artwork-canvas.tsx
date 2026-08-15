"use client"

import React, { useEffect, useRef } from "react"

interface ArtworkCanvasProps {
  primaryColor?: string
  secondaryColor?: string
  accentColor?: string
  darkColor?: string
  isPlaying?: boolean
  seedText?: string
  className?: string
}

export function ArtworkCanvas({
  primaryColor = "#2b4c59",
  secondaryColor = "#5c8088",
  accentColor = "#a9c5c0",
  darkColor = "#0b1519",
  isPlaying = false,
  seedText = "Saloon Vibe",
  className = ""
}: ArtworkCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animFrameId = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let width = (canvas.width = canvas.offsetWidth || 500)
    let height = (canvas.height = canvas.offsetHeight || 500)

    let t = 0

    // Particle nodes for subtle movement
    const particles = Array.from({ length: 24 }).map((_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 80 + 30,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      phase: Math.random() * Math.PI * 2
    }))

    const render = () => {
      t += isPlaying ? 0.015 : 0.005

      ctx.fillStyle = darkColor
      ctx.fillRect(0, 0, width, height)

      // Radial base gradient
      const bgGrad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        20,
        width / 2,
        height / 2,
        width * 0.75
      )
      bgGrad.addColorStop(0, primaryColor)
      bgGrad.addColorStop(0.6, secondaryColor)
      bgGrad.addColorStop(1, darkColor)
      ctx.fillStyle = bgGrad
      ctx.fillRect(0, 0, width, height)

      // Render glowing fluid particles
      particles.forEach((p, idx) => {
        p.x += p.vx * (isPlaying ? 1.5 : 0.5)
        p.y += p.vy * (isPlaying ? 1.5 : 0.5)

        if (p.x < -100) p.x = width + 100
        if (p.x > width + 100) p.x = -100
        if (p.y < -100) p.y = height + 100
        if (p.y > height + 100) p.y = -100

        const dynamicR = p.r + Math.sin(t + p.phase) * 15

        const pGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, dynamicR)
        pGrad.addColorStop(0, idx % 2 === 0 ? accentColor : secondaryColor)
        pGrad.addColorStop(1, "transparent")

        ctx.globalAlpha = 0.35
        ctx.fillStyle = pGrad
        ctx.beginPath()
        ctx.arc(p.x, p.y, dynamicR, 0, Math.PI * 2)
        ctx.fill()
      })

      // Geometric grain / wave overlay inspired by saloon.wtf album aesthetic
      ctx.globalAlpha = 0.15
      ctx.strokeStyle = accentColor
      ctx.lineWidth = 1.5

      for (let i = 0; i < 6; i++) {
        ctx.beginPath()
        const yOffset = height * 0.2 + i * (height * 0.12)
        for (let x = 0; x <= width; x += 15) {
          const y = yOffset + Math.sin(x * 0.01 + t + i) * (20 + i * 4)
          if (x === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.stroke()
      }

      ctx.globalAlpha = 1.0

      animFrameId.current = requestAnimationFrame(render)
    }

    render()

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = canvas.offsetWidth || 500
      height = canvas.height = canvas.offsetHeight || 500
    }

    window.addEventListener("resize", handleResize)

    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current)
      window.removeEventListener("resize", handleResize)
    }
  }, [primaryColor, secondaryColor, accentColor, darkColor, isPlaying, seedText])

  return (
    <div className={`relative overflow-hidden rounded-2xl shadow-2xl border border-white/10 aspect-square ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full block" />
      {/* Vinyl texture highlight overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/10 pointer-events-none" />
      {/* Subtle vignette border */}
      <div className="absolute inset-0 ring-1 ring-inset ring-white/15 rounded-2xl pointer-events-none" />
    </div>
  )
}
