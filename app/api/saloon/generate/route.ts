import { NextResponse } from "next/server"
import { searchRezonanceTracks, RezonanceTrack } from "@/lib/rezonance"

export const runtime = "nodejs"

interface MoodPalette {
  primary: string
  secondary: string
  accent: string
  dark: string
  light: string
}

interface CuratedPreset {
  keywords: string[]
  title: string
  story: string
  era: string
  palette: MoodPalette
  tags: string[]
  queries: { query: string; vibeNote: string }[]
}

const PRESET_MEMORIES: CuratedPreset[] = [
  {
    keywords: ["rain", "monsoon", "delhi", "terrace", "chai", "coffee"],
    title: "Monsoon Terrace & Petrichor",
    story: "Cold water droplets hitting warm asphalt, hot chai in hand, and headphones playing soft acoustic echoes while gray rain clouds envelop the Delhi sky.",
    era: "2015 - 2018",
    palette: {
      primary: "#2b4c59",
      secondary: "#5c8088",
      accent: "#a9c5c0",
      dark: "#0b1519",
      light: "#d5e5e3"
    },
    tags: ["Monsoon", "Indie Acoustic", "Nostalgia", "Rainy Afternoons"],
    queries: [
      { query: "Prateek Kuhad Cold Mess", vibeNote: "Soft rain on windowpanes" },
      { query: "Anuv Jain Baarishein", vibeNote: "Warm tea & petrichor breeze" },
      { query: "Acoustic Rain", vibeNote: "Gentle guitar pluck in dusk" },
      { query: "Local Train Choo Lo", vibeNote: "Unspoken longing & terrace winds" },
      { query: "When Chai Met Toast Khoj", vibeNote: "Sunlight breaking through clouds" },
      { query: "Monsoon Chai & Raindrops", vibeNote: "Balcony silence & fading light" }
    ]
  },
  {
    keywords: ["2012", "drive", "night", "indie", "highway", "car"],
    title: "Midnight Highway 2012",
    story: "Roll down the windows, feel the cool night wind rushing over your knuckles, and let the soaring neon synth waves carry you back to midnight drives in 2012.",
    era: "2010 - 2013",
    palette: {
      primary: "#6b21a8",
      secondary: "#a855f7",
      accent: "#38bdf8",
      dark: "#0f0716",
      light: "#e0e7ff"
    },
    tags: ["Midnight Drive", "Indie Synth", "2012 Vibes", "Highway Neon"],
    queries: [
      { query: "M83 Midnight City", vibeNote: "Midnight skyline reflections" },
      { query: "Gotye Somebody That I Used To Know", vibeNote: "FM radio waves in 2012" },
      { query: "Foster The People Pumped Up Kicks", vibeNote: "Summer windows rolled down" },
      { query: "The XX Intro", vibeNote: "Empty highway under streetlights" },
      { query: "Phoenix 1901", vibeNote: "Pulse of the city at 2 AM" },
      { query: "Fun We Are Young", vibeNote: "Singalong with old friends" }
    ]
  },
  {
    keywords: ["2008", "arcade", "summer", "school", "high school", "soda"],
    title: "Summer of '08 High School Arcade",
    story: "Faded denim jackets, neon arcade tickets, icy cola slushies, and the unstoppable energy of summer break after final exams.",
    era: "2006 - 2009",
    palette: {
      primary: "#ea580c",
      secondary: "#f97316",
      accent: "#facc15",
      dark: "#1c0d02",
      light: "#ffedd5"
    },
    tags: ["Summer 2008", "High School", "Pop Punk", "Arcade Nostalgia"],
    queries: [
      { query: "MGMT Kids", vibeNote: "Polaroid summer warmth" },
      { query: "Empire of the Sun Walking On A Dream", vibeNote: "Glittering afternoon heat" },
      { query: "Coldplay Viva La Vida", vibeNote: "Ringtone era anthems" },
      { query: "Katy Perry I Kissed A Girl", vibeNote: "Boombox playing on beach" },
      { query: "OneRepublic Apologize", vibeNote: "School bus window gazing" },
      { query: "Summer 2008 Arcade Jam", vibeNote: "Sun-bleached arcade glow" }
    ]
  },
  {
    keywords: ["y2k", "2000", "cd", "mp3", "walkman", "cassette", "90s"],
    title: "Y2K MP3 Player & Cassette Tape",
    story: "Tangled earphone wires pulled out of your backpack pocket, custom burned CD mix-tapes, glowing blue backlight displays, and timeless nostalgia.",
    era: "1998 - 2004",
    palette: {
      primary: "#0284c7",
      secondary: "#06b6d4",
      accent: "#f43f5e",
      dark: "#031726",
      light: "#e0f2fe"
    },
    tags: ["Y2K Pop", "Cassette Era", "2000s Nostalgia", "Walkman Mix"],
    queries: [
      { query: "Lucky Ali O Sanam", vibeNote: "Acoustic golden hour" },
      { query: "Silk Route Dooba Dooba", vibeNote: "90s indie pop anthem" },
      { query: "Euphoria Dhoom Pichak Dhoom", vibeNote: "School farewell memories" },
      { query: "Strings Duur", vibeNote: "Stargazing on hostel terrace" },
      { query: "Bombay Vikings Kya Surat Hai", vibeNote: "Discman skipping on bus ride" },
      { query: "Y2K MP3 Cassette Dreams", vibeNote: "Blue backlight & 128kbps MP3s" }
    ]
  }
]

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const prompt: string = body?.prompt || ""

    if (!prompt.trim()) {
      return NextResponse.json(
        { success: false, error: "Please enter a memory or vibe." },
        { status: 400 }
      )
    }

    const lowerPrompt = prompt.toLowerCase()

    // Find best matching preset or generate dynamic memory schema
    const matchedPreset = PRESET_MEMORIES.find((preset) =>
      preset.keywords.some((kw) => lowerPrompt.includes(kw))
    )

    let title: string
    let story: string
    let era: string
    let palette: MoodPalette
    let tags: string[]
    let querySpecs: { query: string; vibeNote: string }[]

    if (matchedPreset) {
      title = matchedPreset.title
      story = matchedPreset.story
      era = matchedPreset.era
      palette = matchedPreset.palette
      tags = matchedPreset.tags
      querySpecs = matchedPreset.queries
    } else {
      // Dynamic memory interpretation engine
      const extractedYears = prompt.match(/\b(19\d\d|20\d\d)\b/g)
      const yearStr = extractedYears ? extractedYears[0] : "Nostalgic Era"

      title = `Memory: ${capitalize(prompt.slice(0, 32))}`
      story = `A nostalgic journey captured from "${prompt}". Distilling the sounds, golden atmosphere, and emotion of that exact moment in time.`
      era = yearStr.length === 4 ? `${parseInt(yearStr) - 2} - ${parseInt(yearStr) + 2}` : "Golden Memories"
      
      palette = generatePaletteFromPrompt(prompt)
      tags = ["Nostalgia", "Memory Mix", yearStr, "Rezonance Resolved"]
      
      querySpecs = [
        { query: `${prompt} songs`, vibeNote: "Atmospheric opener" },
        { query: `${prompt} indie acoustic`, vibeNote: "Warm acoustic touch" },
        { query: `${prompt} hit classic`, vibeNote: "Peak memory anthem" },
        { query: `${prompt} chill vibe`, vibeNote: "Sunset slow down" },
        { query: `${prompt} nostalgia`, vibeNote: "Closing ambient wave" }
      ]
    }

    // Resolve tracks through Rezonance song search engine
    const trackPromises = querySpecs.map(async (spec) => {
      const results = await searchRezonanceTracks(spec.query)
      const track = results[0]
      if (track) {
        return {
          ...track,
          vibeNote: spec.vibeNote
        }
      }
      return null
    })

    const resolvedTracksRaw = await Promise.all(trackPromises)
    let tracks: RezonanceTrack[] = resolvedTracksRaw.filter((t): t is NonNullable<typeof t> => t !== null) as RezonanceTrack[]

    // Deduplicate by ID / title
    const seenIds = new Set<string>()
    tracks = tracks.filter((t) => {
      if (seenIds.has(t.id) || seenIds.has(t.title.toLowerCase())) return false
      seenIds.add(t.id)
      seenIds.add(t.title.toLowerCase())
      return true
    })

    // If fewer than 4 tracks resolved, pad with curated fallback tracks
    if (tracks.length < 4) {
      const fallbackPool = await searchRezonanceTracks(prompt)
      for (const fb of fallbackPool) {
        if (!seenIds.has(fb.id) && !seenIds.has(fb.title.toLowerCase())) {
          tracks.push(fb)
          seenIds.add(fb.id)
          if (tracks.length >= 6) break
        }
      }
    }

    const playlistResponse = {
      id: `saloon-pl-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      prompt,
      title,
      story,
      era,
      palette,
      tags,
      tracks
    }

    return NextResponse.json({
      success: true,
      playlist: playlistResponse
    })
  } catch (error: any) {
    console.error("Saloon Playlist Generation Error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to generate nostalgic playlist." },
      { status: 500 }
    )
  }
}

function capitalize(str: string): string {
  if (!str) return ""
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function generatePaletteFromPrompt(prompt: string): MoodPalette {
  let hash = 0
  for (let i = 0; i < prompt.length; i++) {
    hash = prompt.charCodeAt(i) + ((hash << 5) - hash)
  }
  const h1 = Math.abs(hash) % 360
  const h2 = (h1 + 40) % 360
  const h3 = (h1 + 180) % 360

  return {
    primary: `hsl(${h1}, 65%, 40%)`,
    secondary: `hsl(${h2}, 70%, 55%)`,
    accent: `hsl(${h3}, 85%, 65%)`,
    dark: `hsl(${h1}, 80%, 6%)`,
    light: `hsl(${h1}, 30%, 90%)`
  }
}
