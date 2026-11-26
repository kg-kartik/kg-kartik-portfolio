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
            instantly? That moment, where you drag the audio bar and playback picks up almost immediately, is thanks to
            a well-orchestrated system inside your browser: streams, buffers, byte ranges, and a little-known hero called
            the media engine.
          </p>

          <p>Let's break it down and dive into how all of this happens under the hood.</p>

          <p className="italic text-gray-600 dark:text-gray-400">
            PS: I'll explain it with a live example from a free audio streaming platform built by my friends and me:{" "}
            <Link
              href="https://listen.rezonance.in/"
              className="underline text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors font-medium"
            >
              Rezonance
            </Link>
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">🧠 First: What Is Audio Streaming?</h2>
          <p>
            Imagine you're watching a YouTube video. You don't download the whole thing first. It starts playing right
            away. That's streaming: the browser receives the file bit by bit and plays it as it arrives.
          </p>
          <p>When you press "play", the browser starts by fetching the beginning of the audio.</p>

          <h2 className="text-2xl font-bold mt-8 mb-4">⏩ What Happens When You Click Play?</h2>
          <p>
            When you click the play button, the browser's built-in media engine immediately issues a Range request for
            the audio URL:
          </p>

          <CodeBlock language="http" title="Initial Range Request">
            {`GET /path/to/song.mp3
Range: bytes=0-`}
          </CodeBlock>

          <p>
            <code>Range: bytes=0-</code> tells the server, "Start at byte 0 and send me everything from there." There is
            no end value, so the browser is asking for the rest of the file. The server responds with a{" "}
            <code>206 Partial Content</code> status and headers like these:
          </p>

          <CodeBlock language="http" title="Server Response">
            {`HTTP/1.1 206 Partial Content
Accept-Ranges: bytes
Content-Range: bytes X-Y/Z
Content-Length: (Y - X + 1)
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
            <li>X is the first byte of this response (0 for the very beginning).</li>
            <li>Y is the last byte of this response.</li>
            <li>Z is the total size of the audio file in bytes.</li>
          </ul>

          <p>
            Y is fixed in the response header before a single byte of audio arrives, so your bandwidth can't change it.
            With <code>bytes=0-</code>, most servers send everything that's left, which is exactly what the screenshot
            shows: <code>0-9776699/9776700</code>, the whole file in one response. Some servers or CDNs cap each chunk to
            a smaller size, but that's their policy, not your network speed. Bandwidth only affects how fast those bytes
            come in.
          </p>

          <p>
            The <code>Accept-Ranges: bytes</code> header is the server telling the browser, "you're allowed to ask me
            for byte ranges." That's what makes seeking possible. Without range support, the server just replies{" "}
            <code>200 OK</code> with the whole file, and seeking either breaks or only works within the part that has
            already downloaded.
          </p>

          <p>
            Fun fact: if you try this in Safari, its first request is often just a tiny probe for{" "}
            <code>Range: bytes=0-1</code>, to check whether the server supports ranges and learn the file size, before
            it asks for the real data.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">⏩ What Happens When You Don't Seek?</h2>

          <p>
            You might be thinking: if you don't seek, the audio obviously streams until the song ends. Absolutely right,
            Pr0grammer, but let's look at how that happens under the hood.
          </p>

          <p>
            Since you're not seeking, the TCP connection that's streaming the audio stays open. The browser's media
            engine takes it from here:
          </p>

          <ul className="list-disc pl-6 my-4">
            <li>It tracks how much data is already buffered and how far ahead of the playhead it wants to stay.</li>
            <li>
              If the amount of downloaded-but-not-yet-played data falls below a threshold (the low-water mark), it pulls
              more data from the stream. [So that's the `buffer` in "buffering" :P]
            </li>
          </ul>

          <p>
            The more interesting part is what happens when the buffer is full. Usually the connection isn't closed. The
            browser simply stops reading from the socket, and TCP flow control slows the server down until the browser
            is ready for more. Browsers differ here, though: Chrome sometimes cancels the request instead and opens a
            new Range request later when it needs more data.
          </p>

          <p>
            In your Network tab, watch the transferred size of the audio request: it keeps growing as bytes arrive in
            real time. (The <code>Content-Length</code> header doesn't change. It's fixed at Y − X + 1 from the start.
            Only the amount actually transferred so far grows.)
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
            alt="Transferred size of the same request growing to 5,456 kB"
            caption="Same request a little later - transferred size has grown to 5,456 kB"
            width={1200}
            height={600}
          />

          <h2 className="text-2xl font-bold mt-8 mb-4">⏩ What Happens When You Seek?</h2>

          <p>
            To jump to a timestamp, the media engine needs to turn time into a byte position. It gets the two pieces it
            needs from different places:
          </p>

          <ul className="list-disc pl-6 my-4">
            <li>
              <strong>Total size</strong> comes from the <code>/Z</code> in <code>Content-Range</code>.
            </li>
            <li>
              <strong>Duration and the time-to-byte mapping</strong> come from the file's own metadata, and where that
              lives depends on the format.
            </li>
          </ul>

          <ul className="list-disc pl-6 my-4">
            <li>
              <strong>MP3:</strong> a Xing/VBRI header near the start of the file holds the duration and a rough
              100-point table that maps time to bytes. For constant-bitrate files it's even simpler: byte offset ≈ time
              × bitrate / 8.
            </li>
            <li>
              <strong>MP4/M4A:</strong> the <code>moov</code> box holds sample tables that give an exact time-to-byte
              mapping. If <code>moov</code> sits at the end of the file (i.e. the file isn't "faststart"), you'll see the
              browser make an extra Range request near the end of the file before playback can even start.
            </li>
          </ul>

          <p>
            The engine can't start at any random byte, though. Audio is stored in small frames of about 23–26 ms each
            (1152 samples per frame for MP3, 1024 for AAC), and decoding has to begin at a frame boundary. So it snaps
            the offset to the nearest frame, drops the old stream, and issues a new Range request from there:
          </p>

          <CodeBlock language="http" title="Seek Range Request">
            {`GET /path/to/song.mp3
Range: bytes=<newByteOffset>-`}
          </CodeBlock>

          <BlogImage
            src="/images/streaming-progress.png"
            alt="Network tab showing new request after seeking - fresh 206 request"
            caption="New request triggered by seeking - browser abandons previous stream and starts fresh from the seek position"
            width={1200}
            height={600}
          />

          <p>
            The server replies with another <code>206</code> starting from that byte, the engine fills a fresh buffer,
            and playback resumes. The bytes you skipped over are never downloaded at all.
          </p>

          <p>
            Pretty cool, right? What feels like a simple "skip to the good part" moment is a smart system working
            behind the scenes to make it smooth. Now you know what's really going on when you hit play or drag that
            audio bar.
          </p>

          <p>
            In the next blog, we'll dive into how the audio is streamed from the server to the client with the magic of
            Node's pipeline.
          </p>

          <p>So stay tuned! And do like and share if you learned something new from this blog :D</p>
        </motion.article>
      </main>
    </div>
  )
}
