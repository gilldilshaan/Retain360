
import { useEffect, useMemo, useState } from "react";
import { concepts } from "../data/concepts";
import "../styles/memory-planner.css";

const STORAGE_KEY = "retain360-memory-review-schedule";

const REVIEW_INTERVALS = [1, 3, 7, 14, 30];

function readSchedule() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

function getNextReviewDate(days) {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function MemoryReviewPlanner() {
  const [schedule, setSchedule] = useState(readSchedule);
  const [showUpcoming, setShowUpcoming] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(schedule));
    } catch {
      // The planner still works for this session if storage is unavailable.
    }
  }, [schedule]);

  const now = new Date();

  const reviewItems = useMemo(() => {
    return concepts
      .map((concept) => {
        const record = schedule[concept.id];
        const dueAt = record?.nextReviewAt
          ? new Date(record.nextReviewAt)
          : null;

        // Concepts with low retention start in the review queue.
        const dueNow =
          !record &&
          (concept.retention <= 60 || concept.status === "fading");

        const isDue = dueNow || (dueAt && dueAt <= now);

        return {
          ...concept,
          record,
          dueAt,
          isDue: Boolean(isDue),
        };
      })
      .filter((concept) => {
        return showUpcoming || concept.isDue;
      })
      .sort((a, b) => {
        // Show the lowest-retention concepts first.
        if (a.isDue !== b.isDue) return a.isDue ? -1 : 1;
        return a.retention - b.retention;
      });
  }, [schedule, showUpcoming]);

  const dueCount = concepts.filter((concept) => {
    const record = schedule[concept.id];

    if (!record) {
      return (
        concept.retention <= 60 ||
        concept.status === "fading"
      );
    }

    return (
      record.nextReviewAt &&
      new Date(record.nextReviewAt) <= now
    );
  }).length;

  function markReviewed(concept) {
    const previous = schedule[concept.id];
    const reviewCount = previous?.reviewCount || 0;

    // Increase the interval after each successful review.
    const intervalIndex = Math.min(
      reviewCount,
      REVIEW_INTERVALS.length - 1
    );
    const nextInterval = REVIEW_INTERVALS[intervalIndex];

    setSchedule((current) => ({
      ...current,
      [concept.id]: {
        reviewCount: reviewCount + 1,
        lastReviewedAt: new Date().toISOString(),
        nextReviewAt: getNextReviewDate(nextInterval),
        intervalDays: nextInterval,
      },
    }));
  }

  return (
    <section className="mrp" aria-labelledby="mrp-title">
      <div className="mrp__header">
        <div>
          <p className="mrp__eyebrow">MEMORY SYSTEM</p>
          <h2 id="mrp-title">Spaced repetition</h2>
          <p className="mrp__description">
            Revisit concepts at the right time to strengthen
            long-term recall.
          </p>
        </div>

        <div className="mrp__count" aria-live="polite">
          <strong>{dueCount}</strong>
          <span>due today</span>
        </div>
      </div>

      <div className="mrp__toolbar">
        <span>
          {showUpcoming
            ? "Due and scheduled concepts"
            : "Your review queue"}
        </span>

        <button
          type="button"
          className="mrp__toggle"
          onClick={() => setShowUpcoming((value) => !value)}
        >
          {showUpcoming ? "Show due only" : "View scheduled"}
        </button>
      </div>

      {reviewItems.length === 0 ? (
        <div className="mrp__empty">
          <span className="mrp__empty-icon" aria-hidden="true">
            ✓
          </span>
          <h3>You're all caught up</h3>
          <p>
            No concepts are due right now. Check your scheduled
            reviews or come back when the next review is due.
          </p>
        </div>
      ) : (
        <div className="mrp__list">
          {reviewItems.map((concept) => (
            <article className="mrp__item" key={concept.id}>
              <div className="mrp__item-main">
                <div className="mrp__item-topline">
                  <span className="mrp__subject">
                    {concept.subject}
                  </span>

                  <span
                    className={
                      concept.isDue
                        ? "mrp__status mrp__status--due"
                        : "mrp__status"
                    }
                  >
                    {concept.isDue
                      ? "Due now"
                      : `Review ${formatDate(
                          concept.record.nextReviewAt
                        )}`}
                  </span>
                </div>

                <h3>{concept.name}</h3>

                <p className="mrp__meta">
                  Semester {concept.semester}
                  {" · "}
                  {concept.retention}% current retention
                </p>

                {concept.record && (
                  <p className="mrp__next">
                    {concept.record.reviewCount} review(s) completed
                    {" · "}
                    Next interval: {concept.record.intervalDays} day(s)
                  </p>
                )}
              </div>

              {concept.isDue ? (
                <button
                  type="button"
                  className="mrp__review-button"
                  onClick={() => markReviewed(concept)}
                >
                  Mark reviewed
                </button>
              ) : (
                <span className="mrp__scheduled-label">
                  Scheduled
                </span>
              )}
            </article>
          ))}
        </div>
      )}

      <p className="mrp__footnote">
        Review intervals: 1, 3, 7, 14 and 30 days. This planner
        stores its own schedule and does not change your existing
        retention scores.
      </p>
    </section>
  );
}
