import { useState } from "react";

export default function KnowledgeMap({ topics = [], onReviewTopic }) {
  const [selectedNodeId, setSelectedNodeId] = useState(6);
  const [hoveredNodeId, setHoveredNodeId] = useState(null);

  const nodes = [
    { id: 1, name: "C Pointers", pct: 42, color: "#96584E", x: 60, y: 50, connections: [4, 7] },
    { id: 7, name: "Memory Mgmt.", pct: 52, color: "#C69255", x: 40, y: 150, connections: [8] },
    { id: 8, name: "Operating Systems", pct: 64, color: "#C69255", x: 180, y: 160, connections: [4] },
    { id: 4, name: "Data Structures", pct: 71, color: "#C69255", x: 210, y: 60, connections: [5, 8] },
    { id: 5, name: "Algorithms", pct: 76, color: "#798165", x: 350, y: 90, connections: [9, 10] },
    { id: 9, name: "DBMS Concepts", pct: 64, color: "#C69255", x: 350, y: 180, connections: [] },
    { id: 10, name: "Python", pct: 91, color: "#798165", x: 480, y: 40, connections: [11] },
    { id: 11, name: "Machine Learning", pct: 81, color: "#798165", x: 500, y: 120, connections: [6, 13] },
    { id: 6, name: "Neural Networks", pct: 83, color: "#798165", x: 520, y: 200, connections: [13] },
    { id: 13, name: "Deep Learning", pct: 78, color: "#798165", x: 650, y: 190, connections: [] },
    { id: 2, name: "Probability", pct: 48, color: "#96584E", x: 640, y: 40, connections: [12] },
    { id: 12, name: "Statistics", pct: 62, color: "#C69255", x: 650, y: 110, connections: [11] },
  ];

  const edges = [
    { from: 1, to: 4 },
    { from: 7, to: 8 },
    { from: 8, to: 4 },
    { from: 4, to: 5 },
    { from: 5, to: 9 },
    { from: 5, to: 10 },
    { from: 10, to: 11 },
    { from: 11, to: 6 },
    { from: 6, to: 13 },
    { from: 2, to: 12 },
    { from: 12, to: 11 },
  ];

  const activeFocusId = hoveredNodeId || selectedNodeId;
  const activeFocusNode = nodes.find((n) => n.id === activeFocusId);
  const connectedIds = activeFocusNode
    ? [activeFocusNode.id, ...activeFocusNode.connections]
    : [];

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  return (
    <section className="exact-connections-section">
      <div className="connections-header-bar">
        <span style={{ color: "#8C6046", fontSize: "14px" }}>☍</span>
        <div>
          <h2 className="connections-heading">KNOWLEDGE CONNECTIONS</h2>
          <p className="connections-subtext">
            Explore how concepts connect across disciplines. Click a concept to inspect.
          </p>
        </div>
      </div>

      <div className="connections-map-canvas-card">
        <svg
          viewBox="0 0 760 250"
          className="connections-network-svg"
          aria-label="Interactive Knowledge Graph"
        >
          {edges.map((edge, idx) => {
            const start = nodes.find((n) => n.id === edge.from);
            const end = nodes.find((n) => n.id === edge.to);
            if (!start || !end) return null;

            const isEdgeHighlighted =
              activeFocusId &&
              (edge.from === activeFocusId || edge.to === activeFocusId);

            const isDimmed =
              activeFocusId &&
              !connectedIds.includes(edge.from) &&
              !connectedIds.includes(edge.to);

            return (
              <line
                key={idx}
                x1={start.x + 48}
                y1={start.y + 14}
                x2={end.x + 48}
                y2={end.y + 14}
                stroke={isEdgeHighlighted ? "#8C6046" : "rgba(44, 39, 37, 0.2)"}
                strokeWidth={isEdgeHighlighted ? "2.5" : "1.2"}
                strokeDasharray={isEdgeHighlighted ? "none" : "3 3"}
                opacity={isDimmed ? 0.2 : 1}
                className="graph-network-line"
              />
            );
          })}

          {nodes.map((node) => {
            const isSelected = selectedNodeId === node.id;
            const isHovered = hoveredNodeId === node.id;
            const isConnected = activeFocusId && connectedIds.includes(node.id);
            const isDimmed = activeFocusId && !isConnected;

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                className="graph-node-group"
                onMouseEnter={() => setHoveredNodeId(node.id)}
                onMouseLeave={() => setHoveredNodeId(null)}
                onClick={() => setSelectedNodeId(node.id)}
                style={{
                  cursor: "pointer",
                  opacity: isDimmed ? 0.25 : 1,
                  transition: "opacity 0.25s ease",
                }}
              >
                <rect
                  x="0"
                  y="0"
                  width="96"
                  height="28"
                  rx="14"
                  fill={node.color}
                  className="node-rect-surface"
                  style={{
                    stroke: isSelected || isHovered ? "#2C2725" : "none",
                    strokeWidth: isSelected || isHovered ? "2.5" : "0",
                  }}
                />
                <text
                  x="48"
                  y="13"
                  textAnchor="middle"
                  fill="#FAF7F1"
                  fontSize="9.5"
                  fontWeight="600"
                >
                  {node.name}
                </text>
                <text
                  x="48"
                  y="23"
                  textAnchor="middle"
                  fill="#F1E4CC"
                  fontSize="9"
                  fontWeight="700"
                >
                  {node.pct}%
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {selectedNode && (
        <div className="connection-selected-hint">
          Selected: <strong>{selectedNode.name}</strong> ({selectedNode.pct}% retention) —{" "}
          <button
            type="button"
            className="view-all-strong-link-btn"
            style={{ display: "inline", padding: 0 }}
            onClick={() => {
              const matched = topics.find(
                (t) => t.name.toLowerCase() === selectedNode.name.toLowerCase()
              ) || {
                id: selectedNode.id,
                name: selectedNode.name,
                subject: "Core",
                retention: selectedNode.pct,
                lastRevised: "Recently",
              };
              if (onReviewTopic) onReviewTopic(matched);
            }}
          >
            Review this topic →
          </button>
        </div>
      )}
    </section>
  );
}
