import React, { useRef, useState } from "react"

export default function Tabs({ items, defaultIndex = 0, onSelect }) {
  const [activeIndex, setActiveIndex] = useState(defaultIndex)
  const tabListRef = useRef(null)

  const handleSelect = (index) => {
    setActiveIndex(index)
    onSelect?.(index)
  }

  return (
    <div className="tabs-wrapper" aria-label="Tabs">
      <div className="tabs-nav" role="tablist" ref={tabListRef}>
        {items.map((item, index) => (
          <button
            key={item.value != null ? item.value : index}
            role="tab"
            aria-controls={`tab-panel-${index}`}
            aria-selected={activeIndex === index}
            onClick={() => handleSelect(index)}
            className="tab-btn"
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="tabs-panel-wrapper">
        {items.map((item, index) => (
          <div
            key={index}
            className="tabs-panel"
            id={`tab-panel-${index}`}
            role="tabpanel"
            aria-hidden={activeIndex !== index}
          >
            {item.content}
          </div>
        ))}
      </div>
    </div>
  )
}