"use client"

import { useState } from "react"
import type { StudyNote } from "@/lib/types"

export default function EditarAnotacaoPage({ params }: { params: { id: string } }) {
  const [note, setNote] = useState<StudyNote | null>(null)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("anatomia")
  const [tags, setTags] = useState<string[]>([])
