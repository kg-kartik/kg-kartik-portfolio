import type { Metadata } from "next"
import ReactInternalsBlogClient from "./react-internals-client"

export const metadata: Metadata = {
  title: "Diving Deep Into React's Rendering Process | Kartik Goel",
  description:
    "Explore the internal workings of React's rendering process, from triggers and scheduling to rendering and committing changes to the DOM.",
  openGraph: {
    title: "Diving Deep Into React's Rendering Process",
    description: "Understanding how React schedules, renders, and commits updates to the DOM.",
    images: [
      {
        url: "https://i.postimg.cc/VsXX1Pqn/Chat-GPT-Image-May-30-2025-04-45-32-PM.png",
        width: 1200,
        height: 600,
        alt: "React rendering process visualization",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Diving Deep Into React's Rendering Process",
    description: "Understanding how React schedules, renders, and commits updates to the DOM.",
    images: ["https://i.postimg.cc/VsXX1Pqn/Chat-GPT-Image-May-30-2025-04-45-32-PM.png"],
  },
}

export default function ReactInternalsBlogPost() {
  return <ReactInternalsBlogClient />
}