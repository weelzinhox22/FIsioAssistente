"use client"

import { useEffect, useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface MarkdownProps {
  content: string
}

export function Markdown({ content }: MarkdownProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="animate-pulse bg-gray-100 h-40 w-full rounded" />
  }

  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} className="prose max-w-none dark:prose-invert">
      {content}
    </ReactMarkdown>
  )
}
