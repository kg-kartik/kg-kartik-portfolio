"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Loader2,
  ArrowRight,
  Disc3,
  Search
} from "lucide-react"
import { RezonanceTrack } from "@/lib/rezonance"

interface PlaylistData {
  id: string
  prompt: string
  title: string
  story: string
  era: string
  palette: {
    primary: string
    secondary: string
    accent: string
    dark: string
    light: string
  }
  tags: string[]
  tracks: RezonanceTrack[]
}

const DEFAULT_PROMPT = "Late night drive in 2012 listening to synth pop and indie anthems"

const ARTWORK_IMAGES = [
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1920&auto=format&fit=crop&q=90",
  "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1920&auto=format&fit=crop&q=90",
  "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1920&auto=format&fit=crop&q=90",
  "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1920&auto=format&fit=crop&q=90",
  "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1920&auto=format&fit=crop&q=90",
  "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=1920&auto=format&fit=crop&q=90"
]

function getArtworkForPrompt(prompt: string): string {
  const lower = prompt.toLowerCase()
  if (lower.includes("rain") || lower.includes("monsoon")) return ARTWORK_IMAGES[5]
  if (lower.includes("drive") || lower.includes("night") || lower.includes("highway")) return ARTWORK_IMAGES[0]
  if (lower.includes("summer") || lower.includes("arcade") || lower.includes("2008")) return ARTWORK_IMAGES[3]
  if (lower.includes("y2k") || lower.includes("cassette") || lower.includes("mp3")) return ARTWORK_IMAGES[2]
  if (lower.includes("star") || lower.includes("dream")) return ARTWORK_IMAGES[4]
  let hash = 0
  for (let i = 0; i < prompt.length; i++) hash = prompt.charCodeAt(i) + ((hash << 5) - hash)
  return ARTWORK_IMAGES[Math.abs(hash) % ARTWORK_IMAGES.length]
}

export function SaloonApp() {
  const [prompt, setPrompt] = useState("")
  const [playlist, setPlaylist] = useState<PlaylistData | null>(null)
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.85)
  const [isMuted, setIsMuted] = useState(false)
  const [artworkUrl, setArtworkUrl] = useState(ARTWORK_IMAGES[0])
  const [promptFocused, setPromptFocused] = useState(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const hasAutoLoaded = useRef(false)

  const currentTrack = playlist?.tracks[currentTrackIndex] || null

  // Auto-load default playlist on mount
  useEffect(() => {
    if (!hasAutoLoaded.current) {
      hasAutoLoaded.current = true
      generatePlaylist(DEFAULT_PROMPT)
    }
  }, [])

  const generatePlaylist = async (targetPrompt: string) => {
    if (!targetPrompt.trim()) return
    setIsLoading(true)
    setArtworkUrl(getArtworkForPrompt(targetPrompt))

    try {
      const res = await fetch("/api/saloon/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: targetPrompt })
      })
      const data = await res.json()

      if (data.success && data.playlist) {
        setPlaylist(data.playlist)
        setCurrentTrackIndex(0)
        setIsLoading(false)
        // Auto-play after small delay
        setTimeout(() => setIsPlaying(true), 300)
      } else {
        setIsLoading(false)
      }
    } catch {
      setIsLoading(false)
    }
  }

  // Audio source management
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentTrack) return
    audio.src = currentTrack.audioUrl
    audio.load()
    setCurrentTime(0)
    setDuration(currentTrack.duration || 0)
    if (isPlaying) {
      audio.play().catch(() => {})
    }
  }, [currentTrack?.id])

  // Play/pause sync
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentTrack) return
    if (isPlaying) {
      audio.play().catch(() => {})
    } else {
      audio.pause()
    }
  }, [isPlaying])

  // Volume sync
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = isMuted ? 0 : volume
  }, [volume, isMuted])

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
      if (audioRef.current.duration && !isNaN(audioRef.current.duration)) {
        setDuration(audioRef.current.duration)
      }
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const t = parseFloat(e.target.value)
    setCurrentTime(t)
    if (audioRef.current) audioRef.current.currentTime = t
  }

  const handleNext = useCallback(() => {
    if (!playlist) return
    setCurrentTrackIndex((i) => (i + 1) % playlist.tracks.length)
    setIsPlaying(true)
  }, [playlist])

  const handlePrev = useCallback(() => {
    if (!playlist) return
    setCurrentTrackIndex((i) => (i - 1 + playlist.tracks.length) % playlist.tracks.length)
    setIsPlaying(true)
  }, [playlist])

  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (prompt.trim()) {
      setIsPlaying(false)
      generatePlaylist(prompt.trim())
    }
  }

  const fmt = (s: number) => {
    if (isNaN(s) || s < 0) return "0:00"
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec < 10 ? "0" : ""}${sec}`
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-black">
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onEnded={handleNext}
        preload="auto"
      />

      {/* ── FULL-SCREEN ARTWORK BACKGROUND ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={artworkUrl}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          <img
            src={artworkUrl}
            alt="Background artwork"
            className="w-full h-full object-cover"
          />
          {/* Gradient overlays for legibility */}
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/50" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent h-40" />
        </motion.div>
      </AnimatePresence>

      {/* ── TOP BAR ── */}
      <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-5 md:px-8 py-4">
        {/* Left: branding */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Disc3
              className={`w-5 h-5 text-white/90 ${isPlaying ? "animate-spin" : ""}`}
              style={{ animationDuration: "3s" }}
            />
            <span className="text-white/90 text-sm font-bold tracking-tight">saloon</span>
          </div>
          {!isLoading && playlist && (
            <div className="hidden sm:flex items-center gap-1.5 ml-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-white/50 text-[11px] font-mono">
                {playlist.tracks.length} tracks
              </span>
            </div>
          )}
        </div>

        {/* Right: small prompt input */}
        <form
          onSubmit={handlePromptSubmit}
          className={`flex items-center transition-all duration-300 ${
            promptFocused
              ? "bg-white/15 border-white/30 w-80 md:w-96"
              : "bg-white/8 border-white/10 w-52 md:w-64"
          } border rounded-full px-3 py-1.5 backdrop-blur-xl`}
        >
          <Search className="w-3.5 h-3.5 text-white/40 flex-shrink-0 mr-2" />
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onFocus={() => setPromptFocused(true)}
            onBlur={() => setPromptFocused(false)}
            placeholder="describe a memory..."
            className="bg-transparent text-white text-xs placeholder-white/35 focus:outline-none w-full font-light"
          />
          {prompt.trim() && (
            <button
              type="submit"
              className="flex-shrink-0 ml-1 w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <ArrowRight className="w-3 h-3 text-white" />
            </button>
          )}
        </form>
      </header>

      {/* ── CENTERED TITLE OVERLAY ── */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4"
            >
              <Loader2 className="w-8 h-8 text-white/70 animate-spin" />
              <p className="text-white/60 text-sm font-light tracking-wide">
                crafting your playlist...
              </p>
            </motion.div>
          ) : playlist ? (
            <motion.div
              key={playlist.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center px-6 max-w-3xl"
            >
              <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white leading-[0.9] tracking-tighter mb-5 drop-shadow-2xl"
                style={{ textShadow: "0 4px 60px rgba(0,0,0,0.6)" }}
              >
                {playlist.title}
              </h1>
              <p className="text-white/60 text-sm md:text-base font-light max-w-lg mx-auto leading-relaxed italic"
                style={{ textShadow: "0 2px 20px rgba(0,0,0,0.8)" }}
              >
                {playlist.story}
              </p>
              <div className="flex items-center justify-center gap-3 mt-4">
                {playlist.tags.slice(0, 3).map((tag, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-mono text-white/40 border border-white/10 rounded-full px-2.5 py-0.5 backdrop-blur-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* ── BOTTOM PLAYER BAR ── */}
      {currentTrack && !isLoading && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
          className="absolute bottom-0 left-0 right-0 z-40"
        >
          {/* Progress bar — full width, thin, at the very top of player */}
          <div className="w-full h-[3px] bg-white/10 cursor-pointer group relative"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect()
              const pct = (e.clientX - rect.left) / rect.width
              const newTime = pct * (duration || 1)
              setCurrentTime(newTime)
              if (audioRef.current) audioRef.current.currentTime = newTime
            }}
          >
            <div
              className="h-full bg-white transition-all duration-150"
              style={{ width: `${progress}%` }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
              style={{ left: `${progress}%`, transform: `translate(-50%, -50%)` }}
            />
          </div>

          <div className="bg-black/70 backdrop-blur-2xl border-t border-white/5 px-5 md:px-8 py-3">
            <div className="flex items-center justify-between gap-4 max-w-screen-xl mx-auto">
              {/* Left: track info */}
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="relative flex-shrink-0">
                  <img
                    src={currentTrack.artworkUrl}
                    alt={currentTrack.title}
                    className="w-12 h-12 rounded-lg object-cover shadow-xl"
                  />
                  {isPlaying && (
                    <div className="absolute inset-0 rounded-lg bg-black/30 flex items-center justify-center">
                      <div className="flex items-end gap-[2px] h-3">
                        <span className="w-[3px] bg-white rounded-full animate-bounce [animation-delay:-0.3s]" style={{ height: "8px" }} />
                        <span className="w-[3px] bg-white rounded-full animate-bounce [animation-delay:-0.15s]" style={{ height: "12px" }} />
                        <span className="w-[3px] bg-white rounded-full animate-bounce" style={{ height: "6px" }} />
                      </div>
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-white text-sm font-semibold truncate">{currentTrack.title}</p>
                  <p className="text-white/50 text-xs truncate">{currentTrack.artist}</p>
                </div>
              </div>

              {/* Center: transport controls */}
              <div className="flex items-center gap-3">
                <span className="text-white/40 text-[11px] font-mono hidden sm:block w-10 text-right">
                  {fmt(currentTime)}
                </span>

                <button
                  onClick={handlePrev}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all"
                >
                  <SkipBack className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-black hover:scale-105 active:scale-95 transition-transform shadow-xl"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 fill-current" />
                  ) : (
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  )}
                </button>

                <button
                  onClick={handleNext}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all"
                >
                  <SkipForward className="w-4 h-4" />
                </button>

                <span className="text-white/40 text-[11px] font-mono hidden sm:block w-10">
                  {fmt(duration)}
                </span>
              </div>

              {/* Right: volume */}
              <div className="hidden md:flex items-center gap-2 flex-1 justify-end">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-white/50 hover:text-white transition-colors"
                >
                  {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={isMuted ? 0 : volume}
                  onChange={(e) => { setVolume(parseFloat(e.target.value)); setIsMuted(false) }}
                  className="w-20 h-1 bg-white/15 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
