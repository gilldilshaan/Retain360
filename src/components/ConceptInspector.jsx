import React, { useState } from "react"
import RetentionIndicator from "./RetentionIndicator.jsx"
import KnowledgeLineage from "./KnowledgeLineage.jsx"
import KnowledgeDebt from "./KnowledgeDebt.jsx"
import { subjectOf } from "../data/subjects.js"
import { notesFor } from "../data/notes.js"

export default function ConceptInspector({
  concept,
  onSelectConcept,
  onRefresh,
  lookup,
}) {
  if (!concept) return <InspectorEmpty />

  const prereqs = (concept.prerequisites || []).filter((id) => lookup[id])
  const usedLater = (concept.usedIn || []).filter((id) => lookup[id])
  const notes = notesFor(concept.id)
  const status = concept.retention >= 75 ? "Strong" : concept.retention >= 55 ? "Steady" : "Fading"

  return (
    <aside className="inspector" aria-label="Concept inspector">
      <div className="inspector-head">
        <span className="micro">{subjectOf(concept.subject)}</span>
        <h2 className="inspector-title serif">{concept.name}</h2>
        <span className="inspector-status pill">{status}</span>
        <p className="inspector-sub">
          Semester {concept.semester} · {subjectOf(concept.subject)}
        </p>
      </div>

      <div className="hairline" />

      <div className="inspector-body">
        <p className="inspector-desc">{concept.description}</p>

        <section className="inspector-section">
          <RetentionIndicator value={concept.retention} />
        </section>

        {prereqs.length > 0 && (
          <section className="inspector-section">
            <span className="micro section-label">Built On</span>
            <ul className="chip-list">
              {prereqs.map((id) => (
                <li key={id}>
                  <button type="button" className="chip" onClick={() => onSelectConcept(id)}>
                    {lookup[id].name}
                    <span className="chip-sem">S{lookup[id].semester}</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        {usedLater.length > 0 && (
          <section className="inspector-section">
            <span className="micro section-label">Used Later In</span>
            <ul className="chip-list">
              {usedLater.map((id) => (
                <li key={id}>
                  <button type="button" className="chip chip-later" onClick={() => onSelectConcept(id)}>
                    {lookup[id].name}
                    <span className="chip-sem">S{lookup[id].semester}</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        {status === "Fading" && usedLater.length > 0 && (
          <p className="inspector-why">
            <span className="micro">Why this matters</span>
            This is a foundation for what comes next:
            {usedLater
              .slice(0, 2)
              .map((id) => (
                <span key={id} className="chip-sem">
                  {lookup[id]?.name}
                </span>
              ))}
          </p>
        )}

        <KnowledgeLineage concept={concept} onSelectConcept={onSelectConcept} lookup={lookup} />

        <KnowledgeDebt concept={concept} onRefresh={onRefresh} lookup={lookup} />

        <section className="inspector-section">
          <span className="micro section-label">Related Notes</span>
          {notes.length === 0 ? (
            <p className="muted-note">No notes yet for this concept.</p>
          ) : (
            <>
              <p className="note-count">{notes.length} note{notes.length > 1 ? "s" : ""}</p>
              <NoteList notes={notes} />
            </>
          )}
        </section>
      </div>

      <div className="inspector-foot">
        <button type="button" className="btn btn-primary" onClick={() => onRefresh(concept.id)}>
          Quick Refresh
        </button>
      </div>
    </aside>
  )
}

function NoteList({ notes }) {
  const [open, setOpen] = useState(false)
  const visible = open ? notes : notes.slice(0, 1)
  return (
    <div className="note-list">
      {visible.map((n) => (
        <article key={n.id} className="note">
          <span className="note-title">{n.title}</span>
          <span className="micro">{n.created}</span>
        </article>
      ))}
      {notes.length > 1 && (
        <button type="button" className="link-btn" onClick={() => setOpen(!open)}>
          {open ? "Show less" : `View all ${notes.length} notes →`}
        </button>
      )}
    </div>
  )
}

function InspectorEmpty() {
  return (
    <aside className="inspector empty" aria-label="Concept inspector">
      <div className="empty-art" aria-hidden="true">
        <svg width="120" height="96" viewBox="0 0 120 96" fill="none">
          <circle cx="24" cy="24" r="5" fill="#798165" opacity="0.85" />
          <circle cx="86" cy="18" r="4" fill="#2C2725" opacity="0.35" />
          <circle cx="60" cy="52" r="6" fill="#798165" />
          <circle cx="100" cy="66" r="4.5" fill="#2C2725" opacity="0.35" />
          <circle cx="30" cy="78" r="4" fill="#2C2725" opacity="0.35" />
          <path d="M28 27 L56 49 M64 50 L82 22 M67 55 L96 64 M55 56 L33 75 M29 28 L83 20" stroke="#2C2725" strokeOpacity="0.25" strokeWidth="1" />
        </svg>
      </div>
      <span className="micro">Explore Your Knowledge</span>
      <h3 className="empty-title serif">Nothing selected</h3>
      <p className="empty-copy">
        Select a concept to see where it came from, what it connects to, and where you&rsquo;ll use it next.
      </p>
    </aside>
  )
}