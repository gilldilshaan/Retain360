export default function TopicFilterBar({
  search,
  onSearchChange,
  activeFilter,
  onFilterChange,
  selectedSubject,
  onSubjectChange,
  retentionRange,
  onRetentionRangeChange,
  sortBy,
  onSortChange,
  subjectsList = [],
  totalMatches = 0,
  totalCount = 0,
  onResetFilters,
}) {
  const statusFilterOptions = [
    { key: "all", label: "All Topics" },
    { key: "needs-revision", label: "At Risk" },
    { key: "strong", label: "Stable" },
    { key: "recent", label: "Recent" },
  ];

  const hasActiveFilters =
    search.trim() !== "" ||
    activeFilter !== "all" ||
    selectedSubject !== "all" ||
    retentionRange !== "all" ||
    sortBy !== "default";

  return (
    <div className="filter-panel">
      <div className="filter-row-primary">
        <div className="search-field">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="search-svg-icon"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="search-text-input"
            placeholder="Search topic or concept..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {search && (
            <button
              type="button"
              className="search-clear-action"
              onClick={() => onSearchChange("")}
              aria-label="Clear search input"
            >
              ✕
            </button>
          )}
        </div>

        <div className="selects-cluster">
          <div className="custom-select-wrap">
            <select
              aria-label="Filter by Domain"
              className="editorial-select"
              value={selectedSubject}
              onChange={(e) => onSubjectChange(e.target.value)}
            >
              <option value="all">All Domains</option>
              {subjectsList.map((subj) => (
                <option key={subj} value={subj}>
                  {subj}
                </option>
              ))}
            </select>
          </div>

          <div className="custom-select-wrap">
            <select
              aria-label="Filter by Retention Tier"
              className="editorial-select"
              value={retentionRange}
              onChange={(e) => onRetentionRangeChange(e.target.value)}
            >
              <option value="all">All Retention Tiers</option>
              <option value="critical">&lt; 60% Critical</option>
              <option value="moderate">60% – 80% Moderate</option>
              <option value="strong">&gt; 80% Strong</option>
            </select>
          </div>

          <div className="custom-select-wrap">
            <select
              aria-label="Sort Order"
              className="editorial-select"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
            >
              <option value="default">Sort: Default</option>
              <option value="lowest">Retention: Lowest First</option>
              <option value="highest">Retention: Highest First</option>
              <option value="oldest">Revision: Oldest First</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>
        </div>
      </div>

      <div className="filter-row-secondary">
        <div className="status-segmented-control">
          {statusFilterOptions.map((opt) => (
            <button
              key={opt.key}
              type="button"
              className={`segment-btn ${activeFilter === opt.key ? "active" : ""}`}
              onClick={() => onFilterChange(opt.key)}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="filter-meta-bar">
          <span className="results-counter">
            Showing <strong>{totalMatches}</strong> of {totalCount} topics
          </span>
          {hasActiveFilters && (
            <button
              type="button"
              className="clear-filters-action"
              onClick={onResetFilters}
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
