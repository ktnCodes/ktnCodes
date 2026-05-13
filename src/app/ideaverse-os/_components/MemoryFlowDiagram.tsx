"use client";

import { CircuitBoard, type CircuitNode, type CircuitConnection } from "@/components/fx/CircuitBoard";

const NODES: CircuitNode[] = [
  { id: "query", x: 60, y: 80, label: "Query", status: "active", size: "md" },
  { id: "agentic", x: 220, y: 80, label: "00 agentic-OS", status: "active", size: "md" },
  { id: "cortex", x: 360, y: 220, label: "10 cortex", status: "processing", size: "lg" },
  { id: "work", x: 220, y: 360, label: "20 work", status: "active", size: "md" },
  { id: "personal", x: 500, y: 360, label: "30 personal", status: "active", size: "md" },
  { id: "raw", x: 620, y: 220, label: "40 raw", status: "inactive", size: "md" },
  { id: "response", x: 620, y: 80, label: "Response", status: "active", size: "md" },
];

const CONNECTIONS: CircuitConnection[] = [
  { from: "query", to: "agentic", animated: true },
  { from: "agentic", to: "cortex", animated: true },
  { from: "cortex", to: "work", animated: true },
  { from: "cortex", to: "personal", animated: true },
  { from: "raw", to: "cortex", animated: true, bidirectional: true },
  { from: "cortex", to: "response", animated: true },
];

/**
 * Visualizes how the LLM traverses Kevin's position-addressed memory.
 *
 * The story the diagram tells:
 *   1. A user query enters.
 *   2. 00-agentic-OS loads first — soul, conventions, identity.
 *   3. 10-cortex is the synthesis hub. Always processing. Routes by position.
 *   4. Cortex drills into 20-work or 30-personal based on the query domain.
 *   5. 40-raw flows back into cortex (wiki-compile pipeline, bidirectional).
 *   6. Cortex composes the response.
 *
 * The right-angle traces match a literal circuit, reinforcing the metaphor:
 * positions are addresses, the LLM is the signal, traces are the routing.
 */
export function MemoryFlowDiagram() {
  return (
    <div className="mx-auto w-full max-w-[720px] overflow-x-auto">
      <CircuitBoard
        nodes={NODES}
        connections={CONNECTIONS}
        width={720}
        height={460}
        gridSize={20}
        pulseSpeed={2.5}
        variant="light"
      />
    </div>
  );
}
