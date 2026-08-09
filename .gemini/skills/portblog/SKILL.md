---
name: portblog
description: "Create and publish blog posts on Kartik Goel's Next.js portfolio blog. Use this skill whenever the user wants to add a new blog post, convert a Twitter/X thread into a blog, or publish written content to their blog."
---

# Portblog — Blog Post Creation Skill

This skill automates the creation and publishing of blog posts on Kartik Goel's portfolio at `/Users/kg-kartik/projects/kg-kartik-portfolio`.

## When to Trigger

Activate this skill when the user:
- Wants to add a new blog post
- Wants to convert a Twitter/X article into a blog post
- Says "write a blog", "publish this to my blog", "add this to my blog", etc.
- Mentions "portblog" by name

## Blog Architecture

The blog is built with **Next.js App Router** (not Markdown/MDX). Each blog post consists of:

```
app/blog/<slug>/
├── page.tsx              # Server component with SEO Metadata
└── <slug>-client.tsx     # Client component with full blog content
```

Images are stored in `public/images/`.

## Step-by-Step Process

### 1. Generate the Blog Cover Image

Generate a blog cover image for SEO/OpenGraph preview using the `generate_image` tool:
- **Style**: Clean white background with the blog title in bold, modern sans-serif font (dark black text)
- **Content**: Include a subtle visual element relevant to the topic (e.g., code snippet, diagram)
- **Aesthetic**: Professional tech blog thumbnail, minimal design
- **Save to**: `public/images/<slug>-blog-cover.png`

### 2. Create the Server Page (`page.tsx`)

Create `app/blog/<slug>/page.tsx` with this exact structure:

```tsx
import type { Metadata } from "next"
import <PascalCaseSlug>BlogClient from "./<slug>-client"

export const metadata: Metadata = {
  title: "<Blog Title> | Kartik Goel",
  description: "<Compelling description of the blog post>",
  openGraph: {
    title: "<Blog Title>",
    description: "<Short description>",
    images: [
      {
        url: "/images/<slug>-blog-cover.png",
        width: 1200,
        height: 600,
        alt: "<Descriptive alt text>",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "<Blog Title>",
    description: "<Short description>",
    images: ["/images/<slug>-blog-cover.png"],
  },
}

export default function <PascalCaseSlug>BlogPost() {
  return <<PascalCaseSlug>BlogClient />
}
```

### 3. Create the Client Component (`<slug>-client.tsx`)

Create `app/blog/<slug>/<slug>-client.tsx` following this template:

```tsx
"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { motion } from "framer-motion"
import { ScrollProgress } from "@/components/scroll-progress"
import { PersistentLikeButton } from "@/components/persistent-like-button"
import { BlogImage, CodeBlock } from "@/components/blog-media"

export default function <PascalCaseSlug>BlogClient() {
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
            <EMOJI> <TITLE>
          </motion.h1>
          <div className="flex items-center justify-between mb-8">
            <p className="text-gray-500 dark:text-gray-400"><DATE> · <X> min read</p>
            <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }}>
              <PersistentLikeButton slug="<slug>" />
            </motion.div>
          </div>

          {/* BLOG CONTENT GOES HERE */}
          {/* Use these components: */}
          {/* <CodeBlock language="javascript" title="Optional Title">{`code here`}</CodeBlock> */}
          {/* <BlogImage src="/images/..." alt="..." caption="..." /> */}
          {/* Callout blocks with colored bg and border-l-4 */}

        </motion.article>
      </main>
    </div>
  )
}
```

### 4. Update the Blog Listing Page

Add a new `<article>` block to `app/blog/page.tsx` inside the `<StaggeredChildren>` component. **Add it as the first article** (newest first).

```tsx
<article>
  <Link href="/blog/<slug>" className="block">
    <motion.div
      className="py-6 px-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors -mx-4"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <h3 className="text-2xl font-medium mb-3"><EMOJI> <TITLE></h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        <SHORT_DESCRIPTION>
      </p>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500 dark:text-gray-400"><DATE></span>
        <div className="flex items-center gap-4">
          <PersistentLikeButton slug="<slug>" />
          <span className="text-blue-500 flex items-center">
            Read more <ArrowUpRight className="ml-1 w-4 h-4" />
          </span>
        </div>
      </div>
    </motion.div>
  </Link>
</article>
```

## Available Components

| Component | Import | Usage |
|-----------|--------|-------|
| `CodeBlock` | `@/components/blog-media` | Code snippets with copy button. Props: `language`, `title` (optional), children as template string |
| `BlogImage` | `@/components/blog-media` | Images with zoom, loading spinner, captions. Props: `src`, `alt`, `caption`, `width`, `height`, `zoomable` |
| `PersistentLikeButton` | `@/components/persistent-like-button` | Like button with persistence. Props: `slug` (must match the blog slug) |
| `ScrollProgress` | `@/components/scroll-progress` | Reading progress bar at top |
| `ThemeToggle` | `@/components/theme-toggle` | Light/dark mode toggle |

## Styling Patterns

### Callout Blocks (Info, Warning, Success)

```tsx
{/* Info callout (blue) */}
<div className="my-8 p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded">
  <p className="text-blue-800 dark:text-blue-300 italic">Your info text here</p>
</div>

{/* Warning callout (yellow) */}
<div className="my-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 rounded">
  <h4 className="font-bold text-yellow-800 dark:text-yellow-300 mb-2">Warning Title</h4>
  <p className="text-yellow-800 dark:text-yellow-300">Warning text here</p>
</div>

{/* Success callout (green) */}
<div className="my-8 p-4 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 rounded">
  <h4 className="font-bold text-green-800 dark:text-green-300 mb-2">Key Takeaway</h4>
  <p className="text-green-800 dark:text-green-300">Takeaway text here</p>
</div>
```


### Section Headings

```tsx
<h2 className="text-2xl font-bold mt-8 mb-4">Section Title</h2>
<h3 className="text-xl font-bold mt-6 mb-3">Subsection Title</h3>
```

### Lists

```tsx
<ul className="list-disc pl-6 my-4">
  <li><strong>Bold item</strong> — description</li>
</ul>
```

## Content Formatting Guidelines

When formatting user-provided articles into blog posts:

1. **Preserve the provided text** — Do not artificially expand or alter the content; use the article/text as provided by the user.
2. **Keep styling simple & clean** — Do not bold or italicize words unnecessarily within body paragraphs. Keep inline formatting consistent and clean. Headings (`h2`, `h3`) are fine.
3. **Avoid AI slop** — Write in a direct, clean, and concise technical tone. Avoid dramatic intro/outro phrases, artificial hype, and conversational filler.
4. **Add code blocks** — Format code snippets cleanly with the `<CodeBlock>` component.
5. **Use HTML entities** — Always use `&apos;` for apostrophes and `&quot;` for quotes in JSX.
6. **Keep the author's voice** — Preserve the exact tone and wording from the provided article.

## Blog Cover Image Guidelines

When generating blog cover images:
- **Background**: Always white/light
- **Title**: Bold, modern sans-serif font, dark text, prominently displayed
- **Visual**: Subtle code snippet or diagram related to the topic
- **Style**: Professional, clean, minimal — no device frames
- **Dimensions**: Aim for 1200x630 aspect ratio (OpenGraph standard)

## Verification

After creating all files, run `npm run dev` to verify the blog compiles without errors.
