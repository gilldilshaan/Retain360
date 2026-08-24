import React from "react"
import NoteCard from "./NoteCard.jsx"

// Deterministic patterns so the grid feels staggered but
// doesn't reshuffle heights every render.
const SIZE_PATTERN = [
  "h-tall", "h-short", "h-medium", "h-short", "h-medium",
  "h-tall", "h-medium", "h-short", "h-tall",
]

const COLOR_PATTERN = [
  "variant-a", "variant-sage", "variant-a", "variant-b", "variant-a",
  "variant-sage", "variant-b", "variant-a", "variant-sage",
]

export default function NotesGrid({ notes, pinnedIds, onPin, onOpen }) {
  return (
    <div className="notes-grid">
      {notes.map((note, index) => {
        const isPinned = pinnedIds.includes(note.id)

        return (
          <NoteCard
            key={note.id}
            note={note}
            isPinned={isPinned}
            onPin={onPin}
            onOpen={onOpen}
            sizeClass={SIZE_PATTERN[index % SIZE_PATTERN.length]}
            colorVariant={isPinned ? "variant-pinned" : COLOR_PATTERN[index % COLOR_PATTERN.length]}
          />
        )
      })}
    </div>
  )
}