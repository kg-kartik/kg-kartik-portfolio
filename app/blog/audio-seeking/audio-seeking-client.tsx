"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { motion } from "framer-motion"
import { ScrollProgress } from "@/components/scroll-progress"
import { PersistentLikeButton } from "@/components/persistent-like-button"
import { BlogImage, CodeBlock } from "@/components/blog-media"

export default function AudioSeekingBlogClient() {

  return (
    <div className="min-h-screen bg-white dark:bg-[#0d0d0d] dark:text-white transition-colors duration-300 relative">
      {/* Dot pattern background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f1f1f_1px,transparent_1px)] [background-size:20px_20px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/60 to-white/80 dark:from-[#0d0d0d]/80 dark:via-[#0d0d0d]/60 dark:to-[#0d0d0d]/80" />
      </div>
      <ScrollProgress />
      <header className="border-b border-gray-100 dark:border-gray-800/50 bg-white/80 dark:bg-[#0d0d0d]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="text-xl font-medium"
            >
              Kartik Goel
            </motion.h1>
            <div className="flex items-center gap-4">
              <Link href="/blog" className="text-blue-500 hover:text-blue-700 transition-colors flex items-center">
                <ArrowLeft className="mr-1 w-4 h-4" /> Back to blog
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 max-w-2xl">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="prose prose-slate dark:prose-invert max-w-none"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-3xl font-bold mb-4"
          >
            🎧 Behind the Skip: How Audio Streaming Just Works
          </motion.h1>
          <div className="flex items-center justify-between mb-8">
            <p className="text-gray-500 dark:text-gray-400">May 30, 2025 · 5 min read</p>
            <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }}>
              <PersistentLikeButton slug="audio-seeking" />
            </motion.div>
          </div>

          <p>
            Have you ever listened to a song or podcast online, skipped to your favorite part, and it just worked
            instantly? That magic moment — where you drag the audio bar and the playback is still handled quietly — is
            thanks to something beautifully orchestrated system inside your browser — streams, buffers, byte ranges, and
            a little-known hero called the media engine.
          </p>

          <p>Let's break it down and dive deep into how how all this happens under the hood.</p>

          <p className="italic text-gray-600 dark:text-gray-400">
            PS: Will be explaining the same with the live example of a free audio streaming Platform built by me and my
            friends. -{" "}
            <Link
              href="https://listen.rezonance.in/"
              className="underline text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors font-medium"
            >
              Rezonance
            </Link>
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">🧠 First: What Is Audio Streaming?</h2>
          <p>
            Imagine you're watching a YouTube video. You don't download the whole thing first — it starts playing right
            away. That's streaming — the browser is getting chunks of the file bit by bit and playing them as they
            arrive.
          </p>
          <p>When you press "play", the browser starts downloading just the beginning of the audio.</p>

          <h2 className="text-2xl font-bold mt-8 mb-4">⏩ What Happens When You click on Play?</h2>
          <p>
            When you click the play button, the browser's built-in media engine immediately issues a Range request for
            the audio URL:
          </p>

          <CodeBlock language="http" title="Initial Range Request">
            {`GET /path/to/song.mp3
Range: bytes=0-`}
          </CodeBlock>

          <p>
            This header range =0 tells the server, "Start at byte 0 and send me as much as you can based on certain
            threshold," which is the main essence of streaming too. The server then responds with a 206 Partial Content
            status and a Content-Range header in the form:
          </p>

          <CodeBlock language="http" title="Server Response">
            {`Content-Range: bytes X–Y/Z
Content-Type: audio/mp4`}
          </CodeBlock>

          <BlogImage
            src="/images/streaming-headers.png"
            alt="Network tab showing detailed headers with Content-Range bytes 0-9776699/9776700"
            caption="Initial network request when clicking play - Content-Range: bytes 0-9776699/9776700"
            width={1200}
            height={600}
          />

          <ul className="list-disc pl-6 my-4">
            <li>X is the starting byte (0 for the very beginning).</li>
            <li>
              Y is the last byte the server will deliver in this chunk over the same open connection—once Y bytes have
              been sent, the connection can continue streaming until it ends by itself(network issue or abort) or the
              client pauses.
            </li>
            <li>Z is the total size of the audio file in bytes.</li>
          </ul>

          <p>Here Y can obviously be much less than Z depending upon the network bandwidth.</p>

          <h2 className="text-2xl font-bold mt-8 mb-4">⏩ What Happens When You don't seek?</h2>

          <p>
            You would be thinking, if you don't seek then obviously the audio will stream till the song/audio ends,
            Absolutely right Pr0grammer, but we would be covering a bit of how it all happens under the hood.
          </p>

          <p>
            Since you're not seeking, the TCP connection that's streaming the audio stays open. The browser's powerful
            media engine takes it from here:
          </p>

          <ul className="list-disc pl-6 my-4">
            <li>It tracks how much data is already buffered and how far ahead it wants to stay.</li>
            <li>
              If the amount of downloaded-but-not-yet-played data falls below a threshold (the low-water mark), the
              engine automatically fetches more data on the stream. [So that's the `buffer` for the "buffer" :P]
            </li>
          </ul>

          <p>
            You'll notice in your Network tab that the data stream's Content-Length keeps growing as each byte of audio
            arrives in real time which adds to the total buffer.
          </p>

          <BlogImage
            src="/images/initial-play.png"
            alt="Network tab showing the initial audio request when clicking play - single 206 request with 3,342 kB transferred"
            caption="Network tab showing the initial audio request when clicking play - single 206 request with 3,342 kB transferred"
            width={1200}
            height={600}
          />

          <BlogImage
            src="/images/seek-request.png"
            alt="Buffer growing progressively to 5456 kB"
            caption="Buffer growing progressively, byte - 5456 kB"
            width={1200}
            height={600}
          />

          <h2 className="text-2xl font-bold mt-8 mb-4">⏩ What Happens When You seek?</h2>

          <p>
            We should know that after parsing just a few header bytes of the audio file, the media engine immediately
            learns both the file's total duration and its total byte size through which it maps the time and byte and
            thus knows the byte corresponding to the time stamp.
          </p>

          <p>
            So, the moment you seek, the engine calculates your new playhead position in bytes by using that same
            time-to-byte mapping and snapping to the nearest sync point. It then issues a Range header for that offset:
          </p>

          <CodeBlock language="http" title="Seek Range Request">
            {`GET /path/to/song.mp3
Range: bytes=<newByteOffset>-`}
          </CodeBlock>

          <BlogImage
            src="/images/streaming-progress.png"
            alt="Network tab showing new request after seeking - fresh 206 request with 5,456 kB"
            caption="New request triggered by seeking - browser abandons previous stream and starts fresh from the seek position"
            width={1200}
            height={600}
          />

          <p>
            Pretty cool, right? What feels like a simple "skip to the good part" moment is actually a smart system
            working behind the scenes to make it smooth. Now you know what's really going on when you hit play or drag
            that audio bar. The browser's doing a lot more than just playing sound — it's streaming magic!
          </p>

          <p>
            In our next blog, we will dive into how the audio from server is streamed to the client side with the magic
            of node pipeline.
          </p>

          <p>So, Stay tuned! And do like, share if you learned something new from this blog :D</p>
        </motion.article>
      </main>
    </div>
  )
}
