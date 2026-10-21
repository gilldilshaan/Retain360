import React from "react"
import { FileText, Presentation, FileType2, Image, StickyNote } from "lucide-react"

// Small icon shown in place of the PDF / PPT / DOCX / IMG / NOTE text badge.
export default function FileTypeIcon({ type, size = 15 }) {
  switch (type) {
    case "PDF":
      return <FileText size={size} />
    case "PPT":
      return <Presentation size={size} />
    case "DOCX":
      return <FileType2 size={size} />
    case "IMG":
      return <Image size={size} />
    case "NOTE":
      return <StickyNote size={size} />
    default:
      return <FileText size={size} />
  }
}
