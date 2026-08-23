import React from "react"

const base = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  className: "icon",
  "aria-hidden": true,
}

export const MapIcon = (p) => (
  <svg {...base} {...p}>
    <circle cx="6" cy="5" r="2.6" />
    <circle cx="18" cy="5" r="2.6" />
    <path d="M4 11 L20 11" />
    <path d="M12 11 L12 16" />
    <circle cx="12" cy="19" r="2.6" />
  </svg>
)

export const OverviewIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M5 19 L9 9 L9 19 L13 9 L13 19 L17 9 L17 19" />
    <path d="M5 5 L17 5" />
  </svg>
)

export const MemoryIcon = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="9" r="5" />
    <path d="M7 8 l2 2 M9 10 l2 2 M17 8 l-2 2 M15 10 l-2 2" />
  </svg>
)

export const NotesIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M5 4 h14 v2 h-14 v2 h14 v2 h-14" />
    <path d="M5 14 l6 14" />
  </svg>
)

export const SubjectsIcon = (p) => (
  <svg {...base} {...p}>
    <rect x="5" y="5" width="14" height="3" rx="1" />
    <rect x="5" y="10" width="14" height="3" rx="1" />
    <rect x="5" y="15" width="9" height="3" rx="1" />
  </svg>
)

export const SearchIcon = (p) => (
  <svg {...base} {...p}>
    <circle cx="11" cy="10" r="5" />
    <path d="M19 5 L15 10 L19 15" />
  </svg>
)

export const BellIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M9 5 L15 5 L12 5.5 L9 12 L15 12" />
    <circle cx="12" cy="16" r="1.8" />
    <path d="M7 4 h10 M12 5 h0" />
  </svg>
)

export const ZoomInIcon = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="7" />
    <path d="M12 12 M8 12 L16 12 M12 8 L12 16" />
  </svg>
)

export const ZoomOutIcon = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="7" />
    <path d="M8 12 L16 12" />
  </svg>
)

export const FitIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M6 18 L18 6 L18 18" />
    <rect x="6" y="6" width="12" height="12" rx="1" />
  </svg>
)

export const ResetIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M5 7 l7 0 M12 12 l7 0 M5 17 l7 0" />
  </svg>
)

export const ChevronIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M9 7 L15 12 L9 17" />
  </svg>
)

export const DownArrow = (p) => (
  <svg {...base} {...p}>
    <path d="M12 7 L12 15" />
    <path d="M9 17 L15 13" />
  </svg>
)

export const CheckIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M6 14 L10 10 L18 16" />
  </svg>
)

export const BookmarkIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M6 4 h12 v10 h-6" />
  </svg>
)

export const CloseIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M7 7 L17 17 M17 7 L7 17" />
  </svg>
)

export const SparkIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M12 8 l4 3 l4 8 M8 18 l4 3" />
  </svg>
)