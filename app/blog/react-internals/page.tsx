import type { Metadata } from "next"
import ReactInternalsBlogClient from "./react-internals-client"

export const metadata: Metadata = {
  title: "Understanding basics of React internals | Kartik Goel",
  description:
    "Understanding basics of how React schedules, renders, and commits updates to the DOM.",
  openGraph: {
    title: "Understanding basics of React internals",
    description: "Understanding basics of how React schedules, renders, and commits updates to the DOM.",
    images: [
      {
        url: "https://i.postimg.cc/fRXsgmCQ/react-internals.png?v=2",
        width: 1200,
        height: 600,
        alt: "React internals",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Understanding basics of React internals",
    description: "Understanding basics of how React schedules, renders, and commits updates to the DOM.",
    images: ["https://i.postimg.cc/fRXsgmCQ/react-internals.png?v=2"],
  },
}

export default function ReactInternalsBlogPost() {
  return <ReactInternalsBlogClient />
}