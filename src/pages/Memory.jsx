// src/pages/Memory.jsx
// -------------------------------------------------------------
// Retain360 Memory Center
// Simple React components + data-driven UI.
// -------------------------------------------------------------

import { useEffect, useRef, useState } from "react";
import "./Memory.css";

import {
  overview,
  pulseTopics,
  knowledgeNodes,
  knowledgeEdges,
  strongKnowledge,
  memoryJourney,
  smartInsight,
  fadingTopics,
  recallLevels,
} from "../data/memoryData";

// Convert a score into one of our three visual states.
function getStatus(score) {
  if (score < 60) return "decay";
  if (score < 75) return "active";
  return "retained";
}

// Reveal sections when the user scrolls to them.
function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return [ref, visible];
}

// Small counter animation for the Knowledge Health number.
function useCountUp(target, active) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return undefined;

    const start = performance.now();
    let frameId;

    function animate(now) {
      const progress = Math.min((now - start) / 1000, 1);
      const eased = 1 - (1 - progress) ** 3;

      setValue(Math.round(target * eased));

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      }
    }

    frameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frameId);
  }, [target, active]);

  return value;
}

// Simple reusable SVG arrow.
function Arrow({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

// Simple inline icons keep this project easy to explain.
const icons = {
  book: "▦",
  pulse: "✦",
  connection: "⌘",
  strong: "✧",
  journey: "◷",
  fading: "△",
};

// -------------------------------------------------------------
// Main page
// -------------------------------------------------------------

export default function Memory() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [reviewTopic, setReviewTopic] = useState(null);
  const [showAllFading, setShowAllFading] = useState(false);

  // These are the sections controlled by the sidebar.
  const navItems = [
    { id: "hero", label: "Memory Center", icon: icons.book },
    { id: "pulse", label: "Memory Pulse", icon: icons.pulse },
    { id: "connections", label: "Connections", icon: icons.connection },
    { id: "strong", label: "Strong Knowledge", icon: icons.strong },
    { id: "journey", label: "Journey", icon: icons.journey },
    { id: "fading", label: "What's Fading", icon: icons.fading },
  ];

  // Highlight the sidebar item based on the visible section.
  useEffect(() => {
    const sections = navItems
      .map((item) => document.getElementById(item.id))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  // Smooth-scroll to a dashboard section.
  function goToSection(id) {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    setMobileNavOpen(false);
  }

  function openReview(topic) {
    setReviewTopic(topic);
    document.body.classList.add("no-scroll");
  }

  function closeReview() {
    setReviewTopic(null);
    document.body.classList.remove("no-scroll");
  }

  function startReview() {
    openReview(fadingTopics[0]);
  }

  return (
    <div className="memory-app">
      <Sidebar
        items={navItems}
        activeSection={activeSection}
        mobileOpen={mobileNavOpen}
        setMobileOpen={setMobileNavOpen}
        onNavigate={goToSection}
      />

      <main className="memory-main">
        <Hero
          onStartReview={startReview}
          onExplore={() => goToSection("connections")}
        />

        <MemoryPulse onReview={openReview} />
        <KnowledgeConnections />
        <StrongKnowledge />
        <MemoryJourney onReview={openReview} />

        <WhatsFading
          onReview={openReview}
          onViewAll={() => setShowAllFading(true)}
        />

        <Footer />
      </main>

      {reviewTopic && (
        <RevisionDrawer topic={reviewTopic} onClose={closeReview} />
      )}

      {showAllFading && (
        <FadingModal
          topics={fadingTopics}
          onReview={openReview}
          onClose={() => setShowAllFading(false)}
        />
      )}
    </div>
  );
}

// -------------------------------------------------------------
// Sidebar
// -------------------------------------------------------------

function Sidebar({
  items,
  activeSection,
  mobileOpen,
  setMobileOpen,
  onNavigate,
}) {
  return (
    <>
      <button
        className="mobile-menu-button"
        type="button"
        onClick={() => setMobileOpen((open) => !open)}
        aria-label="Open navigation menu"
        aria-expanded={mobileOpen}
      >
        <span />
        <span />
        <span />
      </button>

      <aside className={`sidebar ${mobileOpen ? "is-open" : ""}`}>
        <div className="brand">
          <div className="brand-logo" aria-hidden="true">R</div>

          <div>
            <strong>Retain360</strong>
            <span>Memory Center</span>
          </div>
        </div>

        <nav className="sidebar-nav" aria-label="Memory Center navigation">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`nav-button ${
                activeSection === item.id ? "is-active" : ""
              }`}
              onClick={() => onNavigate(item.id)}
            >
              <span className="nav-symbol" aria-hidden="true">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-spacer" />

        <blockquote className="quote-card">
          <span className="quote-mark">“</span>
          <p>
            The beautiful thing about learning is that no one can take it
            away from you.
          </p>
          <cite>— B.B. King</cite>
        </blockquote>

        <div className="profile">
          <div className="profile-avatar" aria-hidden="true">S</div>
          <div>
            <strong>Samreet Kaur</strong>
            <span>Student</span>
          </div>
        </div>
      </aside>

      {mobileOpen && (
        <button
          className="sidebar-overlay"
          type="button"
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}

// -------------------------------------------------------------
// Hero / Knowledge Health
// -------------------------------------------------------------

function Hero({ onStartReview, onExplore }) {
  const [ref, visible] = useReveal();
  const health = useCountUp(overview.knowledgeHealth, visible);

  return (
    <section
      id="hero"
      ref={ref}
      className={`memory-section hero-section ${
        visible ? "is-visible" : ""
      }`}
    >
      <div className="hero-grid">
        <div className="hero-copy reveal-item">
          <p className="eyebrow">MEMORY CENTER</p>

          <h1 className="hero-title">
            Knowledge <em>Health.</em>
          </h1>

          <p className="hero-quote">
            “Your degree is only as strong as what you can still recall.”
          </p>

          <p className="hero-description">
            Your strongest domain is{" "}
            <strong>{overview.strongestDomain.name}</strong> (
            {overview.strongestDomain.score}%).{" "}
            <strong>{overview.weakestDomain.name}</strong> (
            {overview.weakestDomain.score}%) currently needs attention.
          </p>

          <div className="hero-buttons">
            <button className="primary-button" type="button" onClick={onStartReview}>
              <span aria-hidden="true">↯</span>
              Start Review
            </button>

            <button className="secondary-button" type="button" onClick={onExplore}>
              Explore Memory
              <Arrow />
            </button>
          </div>
        </div>

        <KnowledgeHealthCircle health={health} visible={visible} />

        <div className="hero-summary reveal-item">
          <p className="summary-kicker">CURRENT SNAPSHOT</p>

          <div className="domain-list">
            {overview.domains.map((domain) => (
              <div className="domain-item" key={domain.name}>
                <span
                  className={`domain-dot ${getStatus(domain.score)}`}
                  aria-hidden="true"
                />
                <span className="domain-name">{domain.name}</span>

                <span className="domain-bar" aria-hidden="true">
                  <span
                    className={`domain-fill ${getStatus(domain.score)}`}
                    style={{ width: visible ? `${domain.score}%` : "0%" }}
                  />
                </span>

                <strong>{domain.score}%</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="stat-strip reveal-item">
        {overview.stats.map((stat) => (
          <div className="stat-card" key={stat.label}>
            <span className="stat-icon" aria-hidden="true">
              {icons[stat.icon] || "•"}
            </span>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

// Four coloured segments make the Knowledge Health circle use the full palette.
function KnowledgeHealthCircle({ health, visible }) {
  const radius = 102;
  const circumference = 2 * Math.PI * radius;

  const segments = [
    { name: "Mathematics", score: 62, className: "yellow" },
    { name: "Programming", score: 73, className: "rust" },
    { name: "DBMS", score: 64, className: "gold" },
    { name: "AI / ML", score: 83, className: "green" },
  ];

  let accumulated = 0;

  return (
    <div className="health-card reveal-item">
      <div className="health-orbit orbit-one" />
      <div className="health-orbit orbit-two" />

      <div className="health-circle">
        <svg viewBox="0 0 240 240" role="img" aria-label={`Knowledge Health ${health}%`}>
          <circle
            cx="120"
            cy="120"
            r={radius}
            className="health-track"
          />

          {segments.map((segment) => {
            const length = (segment.score / 100) * circumference;
            const gap = 5;
            const dash = Math.max(length - gap, 0);

            const circle = (
              <circle
                key={segment.name}
                cx="120"
                cy="120"
                r={radius}
                className={`health-segment ${segment.className}`}
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={-accumulated}
                style={{
                  opacity: visible ? 1 : 0,
                }}
              />
            );

            accumulated += length;
            return circle;
          })}
        </svg>

        <div className="health-center">
          <strong>{health}%</strong>
          <span>KNOWLEDGE HEALTH</span>
          <small>ATTENTION NEEDED</small>
        </div>
      </div>

      <div className="health-legend">
        {segments.map((segment) => (
          <div key={segment.name}>
            <i className={`legend-dot ${segment.className}`} />
            <span>{segment.name}</span>
            <strong>{segment.score}%</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Memory Pulse
// -------------------------------------------------------------

function MemoryPulse({ onReview }) {
  const scrollerRef = useRef(null);
  const [ref, visible] = useReveal();

  function moveCards(direction) {
    scrollerRef.current?.scrollBy({
      left: direction * 330,
      behavior: "smooth",
    });
  }

  return (
    <section
      id="pulse"
      ref={ref}
      className={`memory-section ${visible ? "is-visible" : ""}`}
    >
      <SectionHeading
        eyebrow="MEMORY PULSE"
        title="How your knowledge is holding up."
        description="Explore your concepts and see which areas are staying strong."
        action={
          <div className="scroll-buttons">
            <button type="button" onClick={() => moveCards(-1)} aria-label="Previous topics">
              ←
            </button>
            <button type="button" onClick={() => moveCards(1)} aria-label="Next topics">
              →
            </button>
          </div>
        }
      />

      <div className="pulse-scroller" ref={scrollerRef}>
        {pulseTopics.map((topic) => (
          <button
            className={`pulse-card ${getStatus(topic.score)} ${
              topic.highlighted ? "is-highlighted" : ""
            }`}
            key={topic.id}
            type="button"
            onClick={() => onReview(topic)}
          >
            <span className="card-category">{topic.category}</span>
            <strong>{topic.name}</strong>
            <span className="pulse-score">{topic.score}%</span>

            <Sparkline points={topic.trend} />

            <span className="card-progress">
              <span style={{ width: `${topic.score}%` }} />
            </span>

            <span className="card-action">
              Review topic <Arrow />
            </span>
          </button>
        ))}
      </div>

      <div className="legend-row">
        <span><i className="legend-dot rust" /> High Decay &lt; 60%</span>
        <span><i className="legend-dot yellow" /> Active Recall 60–74%</span>
        <span><i className="legend-dot green" /> Retained ≥ 75%</span>
      </div>
    </section>
  );
}

// Draw a tiny chart without another library.
function Sparkline({ points }) {
  const width = 100;
  const height = 35;
  const step = width / (points.length - 1);

  const path = points
    .map((point, index) => {
      const x = index * step;
      const y = height - (point / 100) * height;
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  return (
    <svg className="sparkline" viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
      <path d={path} />
    </svg>
  );
}

// -------------------------------------------------------------
// Knowledge Connections
// -------------------------------------------------------------

function KnowledgeConnections() {
  const [ref, visible] = useReveal();

  const nodeMap = {};
  knowledgeNodes.forEach((node) => {
    nodeMap[node.id] = node;
  });

  return (
    <section
      id="connections"
      ref={ref}
      className={`memory-section ${visible ? "is-visible" : ""}`}
    >
      <SectionHeading
        eyebrow="KNOWLEDGE CONNECTIONS"
        title="Topics are connected. Master them together."
        description="The lines show how concepts support one another."
      />

      <div className="knowledge-graph">
        <svg
          className="graph-lines"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {knowledgeEdges.map(([fromId, toId], index) => {
            const from = nodeMap[fromId];
            const to = nodeMap[toId];

            if (!from || !to) return null;

            const weak = from.score < 60 || to.score < 60;

            return (
              <line
                key={`${fromId}-${toId}`}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                className={`graph-line ${weak ? "weak" : ""}`}
                style={{ animationDelay: `${index * 0.12}s` }}
              />
            );
          })}
        </svg>

        {knowledgeNodes.map((node, index) => (
          <button
            type="button"
            key={node.id}
            className={`knowledge-node ${getStatus(node.score)}`}
            style={{
              left: `${node.x}%`,
              top: `${node.y}%`,
              animationDelay: `${index * 0.08}s`,
            }}
            onClick={() =>
              document.getElementById("pulse")?.scrollIntoView({
                behavior: "smooth",
              })
            }
            aria-label={`${node.label}, ${node.score}% retention`}
          >
            <strong>{node.label}</strong>
            <span>{node.score}%</span>
          </button>
        ))}
      </div>
    </section>
  );
}

// -------------------------------------------------------------
// Strong Knowledge
// -------------------------------------------------------------

function StrongKnowledge() {
  const [ref, visible] = useReveal();
  const scrollerRef = useRef(null);

  function moveCards(direction) {
    scrollerRef.current?.scrollBy({
      left: direction * 320,
      behavior: "smooth",
    });
  }

  return (
    <section
      id="strong"
      ref={ref}
      className={`memory-section ${visible ? "is-visible" : ""}`}
    >
      <SectionHeading
        eyebrow="STRONG KNOWLEDGE"
        title="Keep it strong. Don't let it fade."
        description="Your strongest concepts deserve regular review too."
        action={
          <div className="scroll-buttons">
            <button type="button" onClick={() => moveCards(-1)} aria-label="Previous strong topics">
              ←
            </button>
            <button type="button" onClick={() => moveCards(1)} aria-label="Next strong topics">
              →
            </button>
          </div>
        }
      />

      <div className="strong-scroller" ref={scrollerRef}>
        {strongKnowledge.map((topic) => (
          <article className="strong-card" key={topic.id}>
            {topic.pinned && <span className="pin">★</span>}
            <span className="card-category">{topic.category}</span>
            <h3>{topic.name}</h3>

            <div className="strong-score-row">
              <Sparkline points={topic.trend} />
              <strong>{topic.score}%</strong>
            </div>

            <p>Last revised {topic.lastRevised}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

// -------------------------------------------------------------
// Memory Journey
// -------------------------------------------------------------

function MemoryJourney() {
  const [ref, visible] = useReveal();

  return (
    <section
      id="journey"
      ref={ref}
      className={`memory-section journey-section ${visible ? "is-visible" : ""}`}
    >
      <div className="journey-column">
        <p className="eyebrow">YOUR MEMORY JOURNEY</p>
        <h2 className="section-title">A timeline of your revision activity.</h2>

        <ol className="timeline">
          {memoryJourney.map((item) => (
            <li key={item.id}>
              <span className="timeline-dot" />

              <div>
                <span className="timeline-date">{item.when}</span>
                <strong>{item.topic}</strong>
                <p>{item.note}</p>
              </div>

              <strong className="timeline-change">
                {item.from}% → {item.to}%
              </strong>
            </li>
          ))}
        </ol>
      </div>

      <aside className="smart-insight">
        <p className="eyebrow">✦ SMART INSIGHT</p>

        <h2>{smartInsight.message}</h2>

        <div className="next-action">
          <span>NEXT BEST ACTION</span>
          <strong>{smartInsight.action.title}</strong>
          <p>Estimated impact: {smartInsight.action.impact}</p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={() =>
            document.getElementById("fading")?.scrollIntoView({
              behavior: "smooth",
            })
          }
        >
          Start Recommended Review
          <Arrow />
        </button>
      </aside>
    </section>
  );
}

// -------------------------------------------------------------
// What's Fading
// -------------------------------------------------------------

function WhatsFading({ onReview, onViewAll }) {
  const [ref, visible] = useReveal();

  return (
    <section
      id="fading"
      ref={ref}
      className={`memory-section fading-section ${visible ? "is-visible" : ""}`}
    >
      <SectionHeading
        eyebrow="WHAT'S FADING"
        title="Knowledge becomes fragile when it isn't revisited."
        description="These concepts need attention. A short revision today can protect long-term recall."
      />

      <div className="fading-list">
        {fadingTopics.slice(0, 3).map((topic, index) => (
          <article className="fading-row" key={topic.id}>
            <span className="fading-number">
              {String(index + 1).padStart(2, "0")}
            </span>

            <div className="fading-topic">
              <strong>{topic.name}</strong>
              <span>{topic.category}</span>
            </div>

            <div className="fading-score">
              <strong>{topic.score}%</strong>
              <span>↓ {topic.drop}%</span>
            </div>

            <div className="fading-date">
              <strong>{topic.lastRevised}</strong>
              <span>Last revised</span>
            </div>

            <span className={`urgency ${topic.urgency.toLowerCase().replace(" ", "-")}`}>
              {topic.urgency}
            </span>

            <button
              className="outline-button"
              type="button"
              onClick={() => onReview(topic)}
            >
              Review <Arrow />
            </button>
          </article>
        ))}
      </div>

      <button
        className="text-button"
        type="button"
        onClick={onViewAll}
      >
        View all fading topics
        <Arrow />
      </button>
    </section>
  );
}

// Modal for the previously non-working "View all fading topics" action.
function FadingModal({ topics, onReview, onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <section
        className="fading-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="fading-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-heading">
          <div>
            <p className="eyebrow">ALL FADING TOPICS</p>
            <h2 id="fading-modal-title">Topics that need another pass.</h2>
          </div>

          <button
            className="close-button"
            type="button"
            onClick={onClose}
            aria-label="Close fading topics"
          >
            ×
          </button>
        </div>

        <div className="modal-topic-list">
          {topics.map((topic) => (
            <article className="modal-topic" key={topic.id}>
              <div>
                <strong>{topic.name}</strong>
                <span>{topic.category}</span>
              </div>

              <strong className="modal-score">{topic.score}%</strong>

              <button
                className="outline-button"
                type="button"
                onClick={() => {
                  onClose();
                  onReview(topic);
                }}
              >
                Review <Arrow />
              </button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

// -------------------------------------------------------------
// Revision drawer
// -------------------------------------------------------------

function RevisionDrawer({ topic, onClose }) {
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [score, setScore] = useState(topic.score);
  const [notes, setNotes] = useState("");

  const difference = score - topic.score;

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <aside
        className="revision-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="revision-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="close-button"
          type="button"
          onClick={onClose}
          aria-label="Close revision panel"
        >
          ×
        </button>

        <p className="eyebrow">{topic.category}</p>
        <h2 id="revision-title">{topic.name}</h2>

        <div className="drawer-meta">
          <div>
            <span>Current retention</span>
            <strong>{topic.score}%</strong>
          </div>

          <div>
            <span>Last revised</span>
            <strong>{topic.lastRevised}</strong>
          </div>
        </div>

        <div className="drawer-progress">
          <span style={{ width: `${topic.score}%` }} />
        </div>

        <h3>How well can you recall this?</h3>

        <div className="recall-grid">
          {recallLevels.map((level) => (
            <button
              key={level.id}
              type="button"
              className={selectedLevel === level.id ? "selected" : ""}
              onClick={() => {
                setSelectedLevel(level.id);
                setScore(Math.round((level.min + level.max) / 2));
              }}
            >
              <strong>{level.label}</strong>
              <span>{level.range}</span>
            </button>
          ))}
        </div>

        <label htmlFor="confidence-slider">Recall confidence</label>

        <input
          id="confidence-slider"
          type="range"
          min="0"
          max="100"
          value={score}
          onChange={(event) => setScore(Number(event.target.value))}
        />

        <div className="slider-values">
          <span>0%</span>
          <strong>{score}%</strong>
          <span>100%</span>
        </div>

        <label htmlFor="revision-notes">Revision notes (optional)</label>

        <textarea
          id="revision-notes"
          maxLength="300"
          value={notes}
          placeholder={topic.notesPlaceholder}
          onChange={(event) => setNotes(event.target.value)}
        />

        <div className="after-revision">
          <div>
            <span>New retention</span>
            <strong>{score}%</strong>
          </div>

          <div>
            <span>Change</span>
            <strong className={difference >= 0 ? "positive" : "negative"}>
              {difference >= 0 ? "↑" : "↓"} {Math.abs(difference)}%
            </strong>
          </div>
        </div>

        <button className="primary-button full-button" type="button" onClick={onClose}>
          ✓ Complete Revision
        </button>
      </aside>
    </div>
  );
}

// -------------------------------------------------------------
// Small reusable heading
// -------------------------------------------------------------

function SectionHeading({ eyebrow, title, description, action }) {
  return (
    <header className="section-heading">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="section-title">{title}</h2>
        {description && <p className="section-description">{description}</p>}
      </div>

      {action}
    </header>
  );
}

function Footer() {
  return (
    <footer className="page-footer">
      <strong>Retain360</strong>
      <span>Memory Center · Keep what you've learned within reach.</span>
    </footer>
  );
}

