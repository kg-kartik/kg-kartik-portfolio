import type { Metadata } from "next"
import AudioSeekingBlogClient from "./audio-seeking-client"

export const metadata: Metadata = {
  title: "Behind the Skip: How Audio Streaming Just Works | Kartik Goel",
  description:
    "Explore the magic behind seamless audio seeking and streaming in modern browsers. Learn how range requests, buffers, and media engines work together.",
  openGraph: {
    title: "Behind the Skip: How Audio Streaming Just Works",
    description: "Explore the magic behind seamless audio seeking and streaming in modern browsers.",
    images: [
      {
        url: "https://i.postimg.cc/VsXX1Pqn/Chat-GPT-Image-May-30-2025-04-45-32-PM.png",
        width: 1200,
        height: 600,
        alt: "Audio streaming network requests visualization",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Behind the Skip: How Audio Streaming Just Works",
    description: "Explore the magic behind seamless audio seeking and streaming in modern browsers.",
    images: ["https://i.postimg.cc/VsXX1Pqn/Chat-GPT-Image-May-30-2025-04-45-32-PM.png"],
  },
}

export default function AudioSeekingBlogPost() {
  return <AudioSeekingBlogClient />
}
