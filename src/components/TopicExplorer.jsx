import EmptyState from "./EmptyState";

export default function TopicExplorer({
  search,
  onSearchChange,
  selectedSubject,
  onSubjectChange,
  selectedStatus,
  onStatusChange,
  sortBy,
  onSortChange,
  subjectsList = [],
  filteredTopics = [],
  totalTopicsCount = 0,
  onReviewTopic,
  onResetFilters,
}) {
  const hasFilters =
    search.trim() !== "" ||
    selectedSubject !== "all" ||
    selectedStatus !== "all" ||
    sortBy !== "default";

  const getRetentionTagClass = (retention) => {
    if (retention < 60) return "tag-decay";
    if (retention < 75) return "tag-active";
    return "tag-strong";
  };

  return (
    <section id="topic-explorer" className="editorial-explorer-scene">
      <div className="scene-header-flow">
        <div className="scene-title-group">
          <span className="scene-label-eyebrow">COMPLETE INVENTORY</span>
          <h2 className="scene-headline-main">Topic Explorer</h2>
          <p className="scene-subtitle-text">
            Search, filter, and inspect your full academic knowledge library.
          </p>
        </div>

        <span className="explorer-item-tally">
          {filteredTopics.length} of {totalTopicsCount} topics
        </span>
      </div>

      <div className="explorer-filter-bar">
        <div className="explorer-search-wrapper">
          <input
            type="text"
            className="explorer-search-input"
            placeholder="Search concepts, algorithms, theorems..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {search && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => onSearchChange("")}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        <div className="explorer-select-group">
          <select
            aria-label="Filter by subject"
            className="explorer-select-control"
            value={selectedSubject}
            onChange={(e) => onSubjectChange(e.target.value)}
          >
            <option value="all">All Subjects</option>
            {subjectsList.map((subj) => (
              <option key={subj} value={subj}>
                {subj}
              </option>
            ))}
          </select>

          <select
            aria-label="Filter by status"
            className="explorer-select-control"
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="fading">Fading (&lt;60%)</option>
            <option value="active">Active (60–74%)</option>
            <option value="strong">Strong (&ge;75%)</option>
          </select>

          <select
            aria-label="Sort order"
            className="explorer-select-control"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="default">Sort: Priority</option>
            <option value="lowest">Retention: Lowest First</option>
            <option value="highest">Retention: Highest First</option>
            <option value="name">Alphabetical (A–Z)</option>
          </select>

          {hasFilters && (
            <button
              type="button"
              className="explorer-reset-btn"
              onClick={onResetFilters}
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {filteredTopics.length > 0 ? (
        <div className="explorer-rows-list">
          {filteredTopics.map((topic) => {
            const tagClass = getRetentionTagClass(topic.retention);
            return (
              <div
                key={topic.id}
                className="explorer-row-card"
                onClick={() => onReviewTopic(topic)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onReviewTopic(topic);
                  }
                }}
              >
                <div className="explorer-col-name">
                  <h4 className="explorer-topic-heading">{topic.name}</h4>
                  <span className="explorer-subject-sub">{topic.subject}</span>
                </div>

                <div className="explorer-col-retention">
                  <span className={`explorer-retention-pill ${tagClass}`}>
                    {topic.retention}%
                  </span>
                </div>

                <div className="explorer-col-revised">
                  <span className="explorer-revised-text">
                    Reviewed {topic.lastRevised}
                  </span>
                </div>

                <div className="explorer-col-action">
                  <button
                    type="button"
                    className="explorer-action-cue-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      onReviewTopic(topic);
                    }}
                  >
                    Review →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="No topics match query"
          message="Adjust search keywords or reset domain and status filters."
          actionLabel="Reset all filters"
          onAction={onResetFilters}
        />
      )}
    </section>
  );
}
