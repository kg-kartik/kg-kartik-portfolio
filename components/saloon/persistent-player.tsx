"use client"

import React, { useEffect, useRef, useState } from "react"
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Radio } from "lucide-react"
import { RezonanceTrack } from "@/lib/rezonance"

interface PersistentPlayerProps {
  currentTrack: RezonanceTrack | null
  isPlaying: boolean
  onTogglePlay: () => void
  onNext: () => void
  onPrevious: () => void
  accentColor?: string
}

export function PersistentPlayer({
  currentTrack,
  isPlaying,
  onTogglePlay,
  onNext,
  onPrevious,
  accentColor = "#a9c5c0"
}: PersistentPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.85)
  const [isMuted, setIsMuted] = useState(false)
  const [audioError, setAudioError] = useState(false)

  // Synchronize audio playback state with currentTrack & isPlaying props
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    if (!currentTrack) {
      audio.pause()
      return
    }

    setAudioError(false)

    if (isPlaying) {
      const playPromise = audio.play()
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn("Audio autoplay prevented or error:", err)
          setAudioError(true)
        })
      }
    } else {
      audio.pause()
    }
  }, [currentTrack, isPlaying])

  // Handle track source change
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentTrack) return

    audio.src = currentTrack.audioUrl
    audio.load()
    setCurrentTime(0)

    if (isPlaying) {
      audio.play().catch(() => setAudioError(true))
    }
  }, [currentTrack?.id])

  // Volume control updates
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
      if (audioRef.current.duration) {
        setDuration(audioRef.current.duration)
      }
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetTime = parseFloat(e.target.value)
    setCurrentTime(targetTime)
    if (audioRef.current) {
      audioRef.current.currentTime = targetTime
    }
  }

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return "0:00"
    const m = Math.floor(secs / 60)
    const s = Math.floor(secs % 60)
    return `${m}:${s < 10 ? "0" : ""}${s}`
  }

  if (!currentTrack) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pt-2">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onEnded={onNext}
        onError={() => setAudioError(true)}
      />

      <div className="max-w-4xl mx-auto backdrop-blur-xl bg-neutral-900/85 text-white border border-white/10 rounded-2xl p-3 shadow-2xl transition-all duration-300">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Left: Track Meta */}
          <div className="flex items-center gap-3 w-full md:w-1/3 min-w-0">
            <div className="relative group flex-shrink-0">
              <img
                src={currentTrack.artworkUrl}
                alt={currentTrack.title}
                className="w-12 h-12 rounded-lg object-cover shadow-md border border-white/10"
              />
              {isPlaying && (
                <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center">
                  {/* SVG Waveform Visualizer */}
                  <div className="flex items-end gap-[2px] h-4">
                    <span className="w-1 bg-white rounded-full animate-bounce [animation-delay:-0.3s] h-full" />
                    <span className="w-1 bg-white rounded-full animate-bounce [animation-delay:-0.15s] h-3" />
                    <span className="w-1 bg-white rounded-full animate-bounce h-4" />
                  </div>
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-semibold truncate text-white/95">
                {currentTrack.title}
              </h4>
              <p className="text-xs text-white/60 truncate">
                {currentTrack.artist} • {currentTrack.album}
              </p>
              {audioError && (
                <p className="text-[10px] text-amber-400 font-mono mt-0.5">
                  Stream reconnecting...
                </p>
              )}
            </div>
          </div>

          {/* Center: Playback Controls & Progress Bar */}
          <div className="flex flex-col items-center gap-1.5 w-full md:w-1/2">
            <div className="flex items-center gap-4">
              <button
                onClick={onPrevious}
                className="text-white/70 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/10"
                title="Previous Track"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={onTogglePlay}
                className="w-10 h-10 rounded-full flex items-center justify-center text-black font-bold transition-all shadow-lg hover:scale-105 active:scale-95"
                style={{ backgroundColor: accentColor || "#ffffff" }}
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 fill-current" />
                ) : (
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                )}
              </button>

              <button
                onClick={onNext}
                className="text-white/70 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/10"
                title="Next Track"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

            {/* Seek Bar */}
            <div className="flex items-center gap-2 w-full text-xs font-mono text-white/60">
              <span className="w-8 text-right text-[11px]">{formatTime(currentTime)}</span>
              <input
                type="range"
                min={0}
                max={duration || currentTrack.duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="flex-1 h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white hover:accent-emerald-400"
              />
              <span className="w-8 text-left text-[11px]">
                {formatTime(duration || currentTrack.duration)}
              </span>
            </div>
          </div>

          {/* Right: Volume & Format Token */}
          <div className="hidden md:flex items-center justify-end gap-3 w-1/4">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="text-white/70 hover:text-white transition-colors"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(parseFloat(e.target.value))
                setIsMuted(false)
              }}
              className="w-20 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
            />
            <div className="flex items-center gap-1 text-[10px] text-white/40 font-mono border border-white/10 px-2 py-0.5 rounded-full">
              <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
              <span>320k</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
