import { Fragment } from 'react';
import { Section } from './Section';

/**
 * "How I build agentic systems" -- a hand-built pipeline diagram. Desktop is
 * an 11-column grid (6 nodes, 5 connectors) with a FAIL branch under the
 * eval gate and a dashed feedback loop; mobile stacks vertically. Static
 * markup, no diagram library, no JS.
 */

interface PipelineNode {
  label: string;
  note: string;
}

const NODES: PipelineNode[] = [
  { label: 'capture', note: 'raw sources -> one inbox' },
  { label: 'triage cascade', note: 'skip / light / deep routing' },
  { label: 'extract', note: 'structured claims, timestamp anchors' },
  { label: 'eval gate', note: 'hard verification -- fails loudly' },
  { label: 'compile', note: 'cross-linked synthesis layer' },
  { label: 'serve / retrieve', note: 'humans + agents query one index' },
];

const EVAL_GATE_INDEX = 3;

// Static literals so the Tailwind scanner picks them up (no string building).
const NODE_COL_START = [
  'col-start-1',
  'col-start-3',
  'col-start-5',
  'col-start-7',
  'col-start-9',
  'col-start-11',
];

const FAIL_LABEL = 'FAIL -> human-in-the-loop';
const LOOP_LABEL = 'feedback -> recompile';

function ArrowRight({ className = 'text-muted' }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 8" className={`h-2 w-7 shrink-0 ${className}`} aria-hidden="true">
      <line x1="0" y1="4" x2="21" y2="4" stroke="currentColor" strokeWidth="1" />
      <path d="M21 1 L27 4 L21 7 Z" fill="currentColor" />
    </svg>
  );
}

function ArrowDown({ className = 'text-muted' }: { className?: string }) {
  return (
    <svg viewBox="0 0 8 24" className={`h-6 w-2 shrink-0 ${className}`} aria-hidden="true">
      <line x1="4" y1="0" x2="4" y2="17" stroke="currentColor" strokeWidth="1" />
      <path d="M1 17 L4 23 L7 17 Z" fill="currentColor" />
    </svg>
  );
}

function NodeBox({ node, className = '' }: { node: PipelineNode; className?: string }) {
  return (
    <div
      className={`flex items-center justify-center rounded-lg border border-hairline bg-surface px-3 py-2.5 text-center font-mono text-xs text-foreground ${className}`}
    >
      {node.label}
    </div>
  );
}

function FailBox() {
  return (
    <span className="rounded-md border border-red-500/30 bg-red-500/5 px-2 py-1 text-center font-mono text-[10px] leading-tight text-red-700">
      {FAIL_LABEL}
    </span>
  );
}

function PipelineDiagram() {
  return (
    <div>
      {/* Desktop: horizontal flow on an 11-column grid. */}
      <div className="hidden gap-y-2 md:grid md:grid-cols-[minmax(0,1fr)_28px_minmax(0,1fr)_28px_minmax(0,1fr)_28px_minmax(0,1fr)_28px_minmax(0,1fr)_28px_minmax(0,1fr)]">
        {NODES.map((node, i) => (
          <Fragment key={node.label}>
            <NodeBox node={node} className="h-full" />
            {i < NODES.length - 1 ? (
              <div className="flex items-center justify-center">
                <ArrowRight />
              </div>
            ) : null}
          </Fragment>
        ))}

        {NODES.map((node, i) => (
          <p
            key={node.label}
            className={`${NODE_COL_START[i]} row-start-2 text-center font-mono text-[10px] leading-tight text-muted`}
          >
            {node.note}
          </p>
        ))}

        {/* FAIL branch under the eval gate */}
        <div className="col-start-7 row-start-3 flex flex-col items-center gap-1 pt-1">
          <ArrowDown className="text-red-400" />
          <FailBox />
        </div>

        {/* Dashed feedback loop under compile..serve */}
        <div className="col-span-3 col-start-9 row-start-3 pb-4 pt-2">
          <div className="relative mx-auto h-9 w-[52%] rounded-b-md border-x border-b border-dashed border-muted/50">
            <span className="absolute -left-[4px] -top-[5px] h-0 w-0 border-x-4 border-x-transparent border-b-[6px] border-b-muted" />
            <span className="absolute -bottom-[7px] left-1/2 -translate-x-1/2 whitespace-nowrap bg-background px-2 font-mono text-[10px] text-muted">
              {LOOP_LABEL}
            </span>
          </div>
        </div>
      </div>

      {/* Mobile: vertical stack with vertical connectors */}
      <div className="flex flex-col items-center md:hidden">
        {NODES.map((node, i) => (
          <Fragment key={node.label}>
            <NodeBox node={node} className="w-full max-w-xs" />
            <p className="mt-1.5 text-center font-mono text-[10px] leading-tight text-muted">
              {node.note}
            </p>
            {i === EVAL_GATE_INDEX ? (
              <div className="my-2 flex items-center gap-1.5">
                <ArrowRight className="text-red-400" />
                <FailBox />
              </div>
            ) : null}
            {i < NODES.length - 1 ? <ArrowDown className="my-2" /> : null}
          </Fragment>
        ))}
        <span className="mt-3 h-4 w-px border-l border-dashed border-muted/50" />
        <span className="mt-1 rounded-md border border-dashed border-muted/50 px-2.5 py-1 font-mono text-[10px] text-muted">
          {LOOP_LABEL}
        </span>
      </div>
    </div>
  );
}

export function PipelineSection() {
  return (
    <Section number="03" name="Pipeline" tone="light-50" className="anim-reveal">
      <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-(--space-md)">
        How I build agentic systems.
      </h2>
      <PipelineDiagram />
    </Section>
  );
}
