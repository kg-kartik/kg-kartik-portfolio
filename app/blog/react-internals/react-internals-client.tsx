"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { motion } from "framer-motion"
import { ScrollProgress } from "@/components/scroll-progress"
import { PersistentLikeButton } from "@/components/persistent-like-button"
import { BlogImage, CodeBlock } from "@/components/blog-media"
import { useTheme } from "next-themes"

export default function ReactInternalsBlogClient() {
  const {theme} = useTheme();
  const currentTheme = theme || 'dark';
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 dark:text-white transition-colors duration-300">
      <ScrollProgress />
      <header className="border-b border-gray-100 dark:border-gray-800">
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
            🔄 Starting diving into React Internals
          </motion.h1>
          <div className="flex items-center justify-between mb-8">
            <p className="text-gray-500 dark:text-gray-400">September 28, 2025 · 8 min read</p>
            <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }}>
              <PersistentLikeButton slug="react-internals" />
            </motion.div>
          </div>

          <p>
            I've been re-reading <Link href="https://jser.dev/2023-07-11-overall-of-react-internals" className="underline text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors">JSER</Link> blogs to delve deeper into React's internals, so I decided to write a blog post about it with my own learnings. In this post, I'll walk through the basics of entire rendering process, from the
            initial trigger to the final paint on screen.
          </p>

          <div className="my-8 p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded">
            <p className="text-blue-800 dark:text-blue-300 italic">
              This is a technical deep dive into React's internals. If you're new to React, you might want to start with
              the official documentation first.
            </p>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">🌱 What is a React Root?</h2>
          <p>
            Before we dive into the internals, let's understand what a <strong>React Root</strong> actually is. 
            A root is the entry point of your React application. It's created using <code>ReactDOM.createRoot()</code> and 
            represents the top-level container where your entire component tree will be rendered.
          </p>

          <CodeBlock language="javascript" title="Creating a React Root">
            {`// This creates a React root
const root = ReactDOM.createRoot(document.getElementById('app'));

// This renders your component tree into that root
root.render(<App />);`}
          </CodeBlock>

          <p>
            Think of the root as the <em>foundation</em> of your React application. It's the bridge between your React 
            components and the actual DOM. Every React application has exactly one root, and this root manages the 
            entire lifecycle of your component tree.
          </p>

          <BlogImage
            src={ theme === 'dark' ? `/images/react-internals-overview-dark.png` : `/images/react-internals-overview-light.png`}
            alt="React internals stages"
            caption="React internals stages"
            width={1200}
            height={600}
            zoomable={false}
          />

          <p className="text-sm text-gray-600 dark:text-gray-400 italic mb-6">
            [Image Ref:{" "}
            <Link
              href="https://jser.dev/2023-07-11-overall-of-react-internals"
              className="underline text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
            >
              JSer.dev React Internals Overview
            </Link>
            ]
          </p>

          <div className="my-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 rounded">
            <p className="text-yellow-800 dark:text-yellow-300 font-medium">
              💡 <strong>Pro Tip:</strong> Keep referring to the React internals flow diagram above as we go through each stage. 
              It will help you visualize how all these pieces connect together!
            </p>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">1. The Trigger Stage</h2>
          <p>Every React update begins with a trigger. There are two primary ways an update gets triggered in React:</p>

          <ul className="list-disc pl-6 my-4">
            <li>
              <strong>ReactDomRoot.render()</strong> — This happens during the initial mount or first render of your
              application
            </li>
            <li>
              <strong>setState</strong> — This occurs when state changes in a component
            </li>
          </ul>

          <p>
            Both of these methods internally call <code>scheduleUpdateOnFiber</code>, which is essentially the first
            internal function called on any update.
          </p>

          <CodeBlock language="javascript" title="Internal React Flow">
          {`// Simplified internal flow
function setState(newState) {
  // ...
  scheduleUpdateOnFiber(fiber);
}

function render(element) {
  // ...
  scheduleUpdateOnFiber(rootFiber);
}`}
          </CodeBlock>

          <h3 className="text-xl font-bold mt-6 mb-3">What is Fiber?</h3>

          <p>
            Based on the previous information, it's clear that updates are scheduled on something called a "Fiber." But
            what exactly is a Fiber?
          </p>

          <p>
            In layman's terms, Fiber is an internal React object that holds a component's state, props, and other
            metadata. It helps React determine what changes to make to the DOM. You can think of it as a powerful
            version of the virtual DOM node.
          </p>

          <p>
            The next part of the Trigger stage is <code>ensureRootIsScheduled</code>, which ensures that an update is
            scheduled on the React root. After this, control passes to the Scheduler stage.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">2. The Schedule Stage</h2>

          <p>This is where React decides when to perform the actual work of updating the DOM.</p>

          <h3 className="text-xl font-bold mt-6 mb-3">ensureRootIsScheduled() → scheduleCallback()</h3>

          <p>
            Here, the update task is passed to the scheduler, which acts like a smart background manager. It queues
            updates based on priority and calls <code>workLoop()</code> when it's time to start processing.
          </p>

          <h3 className="text-xl font-bold mt-6 mb-3">workLoop()</h3>

          <p>
            This is a loop that processes all scheduled updates by traversing through the fiber nodes. During this
            process, React builds a new tree of fiber nodes that includes all the updates.
          </p>

          <div className="my-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 rounded">
            <h4 className="font-bold text-yellow-800 dark:text-yellow-300 mb-2">Why does React need a scheduler?</h4>
            <p className="text-yellow-800 dark:text-yellow-300">
              Not all updates are equally urgent. React uses the Scheduler to prioritize tasks based on their importance
              and breaks larger tasks into smaller ones in concurrent mode. This helps maintain an appropriate frame
              rate and keeps the UI responsive, even during complex updates.
            </p>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">3. The Render Stage</h2>

          <p>
            Once a task is picked up from the scheduler, React needs to compute the changes. It walks through the fiber
            nodes and calculates what needs to change in the DOM.
          </p>

          <p>At this point, React calls one of two functions:</p>

          <ul className="list-disc pl-6 my-4">
            <li>
              <strong>renderRootConcurrent()</strong> — The default in concurrent mode
            </li>
            <li>
              <strong>renderRootSync()</strong> — Used in legacy mode (synchronous and blocking)
            </li>
          </ul>

          <p>
            It's important to note that during this stage, <em>nothing is actually changed in the DOM yet</em>. React is
            only calculating what needs to be changed, essentially creating a to-do list of DOM updates.
          </p>

            <CodeBlock language="javascript" title="Render Phase (Simplified)">
              {`// Simplified render phase
function renderRoot(root, isSync) {
  if (isSync) {
    return renderRootSync(root);
  }
  return renderRootConcurrent(root);
}

// This builds the effect list - a list of DOM updates to be applied later
function renderRootConcurrent(root) {
  // Walk the fiber tree and compute changes
  // ...
  return finishedWork; // The fiber tree with pending effects
}`}
          </CodeBlock>

          <h2 className="text-2xl font-bold mt-8 mb-4">4. The Commit Stage</h2>

          <p>
            This is where React actually applies the changes to the DOM. The commit stage is initiated by calling{" "}
            <code>commitRoot()</code>.
          </p>

          <p>The commit stage is often divided into three phases:</p>

          <h3 className="text-xl font-bold mt-6 mb-3">Before Mutation Phase</h3>

          <p>
            In this phase, React performs tasks that might need the old DOM state before any mutations occur. This
            includes capturing current DOM state for later comparison.
          </p>

          <h3 className="text-xl font-bold mt-6 mb-3">Mutation Phase</h3>

          <p>
            This is where the actual DOM updates happen, such as removing, updating, or inserting nodes. It's important
            to note that even though the DOM is being updated, the browser hasn't painted these changes to the screen
            yet.
          </p>

          <h3 className="text-xl font-bold mt-6 mb-3">Layout Phase</h3>

          <p>
            During this phase, <code>useLayoutEffect</code> hooks are executed. These are synchronous and block the
            browser from painting, which is why they're ideal for tasks that need to run on the final DOM update before
            the screen is painted (like measuring DOM elements or smooth transitions).
          </p>

          <div className="my-8 p-4 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 rounded">
            <h4 className="font-bold text-green-800 dark:text-green-300 mb-2">After the Commit Stage</h4>
            <p className="text-green-800 dark:text-green-300">
              After the commit stage completes, the browser paints the screen, allowing users to see the updated UI.
              Following this, <code>useEffect</code> hooks are executed. Unlike <code>useLayoutEffect</code>,{" "}
              <code>useEffect</code> runs after the browser has painted and is non-blocking, which is why it's
              recommended for most side effects.
            </p>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Conclusion</h2>

          <p>
            Understanding React's internal rendering process helps us write more efficient and performant React
            applications. By knowing how React schedules, renders, and commits updates, we can make better decisions
            about when to use different hooks like <code>useEffect</code> vs <code>useLayoutEffect</code>, and how to
            structure our components for optimal performance.
          </p>

          <p>
            In future posts, I'll dive even deeper into specific parts of this process, particularly focusing on the
            Scheduler and how React prioritizes updates in concurrent mode.
          </p>
        </motion.article>
      </main>
    </div>
  )
}