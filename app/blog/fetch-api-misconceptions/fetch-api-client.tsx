"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { motion } from "framer-motion"
import { ScrollProgress } from "@/components/scroll-progress"
import { PersistentLikeButton } from "@/components/persistent-like-button"
import { BlogImage, CodeBlock } from "@/components/blog-media"

export default function FetchApiBlogClient() {
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
            await fetch() isn&apos;t waiting for what you think it is.
          </motion.h1>
          <div className="flex items-center justify-between mb-8">
            <p className="text-gray-500 dark:text-gray-400">August 9, 2025 · 4 min read</p>
            <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }}>
              <PersistentLikeButton slug="fetch-api-misconceptions" />
            </motion.div>
          </div>

          <BlogImage
            src="/images/fetch-api-blog-cover.png"
            alt="await fetch() isn't waiting for what you think it is."
            width={1200}
            height={600}
          />

          <p>
            You&apos;ve probably written code like this many number of times without ever asking why it needs two .then()s.
          </p>

          <CodeBlock language="javascript" title="Classic Fetch Pattern">
            {`fetch('https://jsonplaceholder.typicode.com/todos/1')
      .then(response => response.json())
      .then(json => console.log(json))`}
          </CodeBlock>

          <p>
            So, we are going to talk about one of the most common misunderstandings about the Fetch API, i.e. &quot;fetch() returns the response body&quot;.
          </p>

          <p>It doesn&apos;t.</p>

          <p>
            And more importantly, it doesn&apos;t even wait for the response in the way most people assume it does.
          </p>

          <p>When you write:</p>

          <CodeBlock language="javascript" title="Basic Fetch Request">
            {`const response = await fetch("/api/user");`}
          </CodeBlock>

          <p>
            You are not waiting for the full HTTP response body, and you are not even waiting for the full response to arrive.
          </p>

          <p>You are only waiting for the browser to say:</p>

          <p className="italic">
            &quot;I&apos;ve started the request, and I&apos;ve received enough information to give you a Response object.&quot; - Interesting right, What even we used await for then?
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Let me explain that</h2>

          <p>
            When we do: <code>const response = await fetch(&quot;/api/user&quot;);</code> the browser immediately starts the network request in the background.
          </p>

          <p>
            But the await does not mean: wait until the server responds fully or wait until JSON is downloaded.
          </p>

          <p>
            Instead, it means wait until the browser has received the response metadata and can construct a response object.
          </p>

          <p>At that point, we already have:</p>

          <ul className="list-disc pl-6 my-4">
            <li>HTTP status (200, 404, 500…)</li>
            <li>headers</li>
            <li>content-type</li>
            <li>a body reference</li>
          </ul>

          <p>But importantly: we do not yet have the actual data.</p>

          <h2 className="text-2xl font-bold mt-8 mb-4">The real surprise: the body is not data we assume to be</h2>

          <p>
            Inside the Response object, the body is not your JSON, text, or file.
          </p>

          <p>It is a ReadableStream</p>

          <CodeBlock language="javascript" title="Response Object Structure">
            {`Response {
  status: 200,
  statusText: "OK",
  headers: Headers { ... },
  body: ReadableStream { locked: false },
  bodyUsed: false,
  ok: true,
  url: "https://api.example.com/user"
}`}
          </CodeBlock>

          <p>
            So even after our fetch call we still haven&apos;t &quot;gotten the response data&quot; in the way most of us think too.
          </p>

          <p>
            We have only gotten access to a stream that will eventually produce it.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Why this design exists</h2>

          <p>
            If fetch() waited for the full response body before resolving, many modern use cases would break or become inefficient like large file downloads, video streaming, ai token streaming responses, etc.
          </p>

          <p>
            Instead, the browser resolves fetch() early so we can inspect headers immediately, decide how to consume the body and start processing data progressively if needed.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">The second async step: consuming the stream</h2>

          <p>
            Once you have the Response, you still need to explicitly consume the body.
          </p>

          <p>For JSON:</p>

          <CodeBlock language="javascript" title="Consuming JSON">
            {`const data = await response.json();`}
          </CodeBlock>

          <p>For text:</p>

          <CodeBlock language="javascript" title="Consuming Text">
            {`const text = await response.text();`}
          </CodeBlock>

          <p>
            And this is where the second misconception appears: &quot;Why is there another await after fetch()?&quot;
          </p>

          <p>
            Because this is a completely separate asynchronous process.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">What response.json() is actually doing</h2>

          <p>When you call:</p>

          <CodeBlock language="javascript" title="Parsing Stream as JSON">
            {`await response.json();`}
          </CodeBlock>

          <p>the browser cant resolve immediately, It must:</p>

          <ul className="list-disc pl-6 my-4">
            <li>Read the entire response body stream until completion</li>
            <li>Decode the bytes into text (typically UTF-8)</li>
            <li>Parse the text as JSON</li>
            <li>Return the resulting JavaScript value</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">The takeaway</h2>

          <ul className="list-disc pl-6 my-4">
            <li>fetch() is responsible for making the HTTP request and returning a Response.</li>
            <li>The Response gives you metadata immediately and exposes the body as a ReadableStream.</li>
            <li>Methods like json(), text(), and blob() are responsible for consuming that stream and converting it into the format your application needs.</li>
          </ul>
        </motion.article>
      </main>
    </div>
  )
}
