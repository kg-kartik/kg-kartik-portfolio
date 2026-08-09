import type { Metadata } from "next"
import FetchApiBlogClient from "./fetch-api-client"

export const metadata: Metadata = {
  title: "await fetch() isn't waiting for what you think it is. | Kartik Goel",
  description:
    "One of the most common misunderstandings about the Fetch API — fetch() doesn't return the response body. Learn what await fetch() is actually waiting for.",
  openGraph: {
    title: "await fetch() isn't waiting for what you think it is.",
    description: "One of the most common misunderstandings about the Fetch API — fetch() doesn't return the response body.",
    images: [
      {
        url: "/images/fetch-api-blog-cover.png",
        width: 1200,
        height: 600,
        alt: "await fetch() isn't waiting for what you think it is. - Blog cover",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "await fetch() isn't waiting for what you think it is.",
    description: "One of the most common misunderstandings about the Fetch API — fetch() doesn't return the response body.",
    images: ["/images/fetch-api-blog-cover.png"],
  },
}

export default function FetchApiBlogPost() {
  return <FetchApiBlogClient />
}
