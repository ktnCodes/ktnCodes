import type { Metadata } from "next";
import Link from "next/link";
import { SectionLabel } from "../../_components/SectionLabel";

export const metadata: Metadata = {
  title: "Cortex frontmatter -- ideaverse-os concepts",
  description:
    "The required frontmatter and typed-edge wikilink prefixes for cortex articles. cortex-compile writes them; cortex-lint enforces them.",
};

const requiredFields: Array<{
  field: string;
  type: string;
  example: string;
  why: string;
}> = [
  {
    field: "title",
    type: "string",
    example: '"Retrieval-augmented generation"',
    why: "The display name. cortex-lint flags articles missing it as errors.",
  },
  {
    field: "description",
    type: "string",
    example: '"What RAG is, and why grounding LLMs in your own documents matters."',
    why: "Two sentences. What this is, why the vault owner cares. Used in 10-cortex/_index.md and the harness's preview pane.",
  },
  {
    field: "topic",
    type: "slug",
    example: '"ai"',
    why: "Routes the article into 10-cortex/<topic>/. cortex-compile uses this to plan merges vs new articles.",
  },
  {
    field: "created",
    type: "YYYY-MM-DD",
    example: "2026-04-01",
    why: "First write date. Never updated.",
  },
  {
    field: "last_compiled",
    type: "YYYY-MM-DD",
    example: "2026-05-08",
    why: "Last time cortex-compile ran on this article. Auto-updated.",
  },
  {
    field: "verified_at",
    type: "YYYY-MM-DD",
    example: "2026-05-08",
    why: "Last time you confirmed the article still matches reality. cortex-lint flags articles where this is older than 90 days.",
  },
  {
    field: "confidence",
    type: "low | medium | high",
    example: "high",
    why: "high = primary research / official docs. medium = credible analysis. low = single source / speculation.",
  },
  {
    field: "staleness_signal",
    type: "string",
    example: '"GPT-4 turbo deprecated, or RAG benchmarks change"',
    why: "A one-line condition that, if true, means the article is stale. cortex-lint best-effort matches this against world knowledge.",
  },
  {
    field: "sources",
    type: "list",
    example: "[\"40-raw/youtube/foo.md\"]",
    why: "Plain list of source paths. The body Sources section adds typed-edge prefixes (see below).",
  },
];

const edges: Array<{ prefix: string; meaning: string }> = [
  {
    prefix: "supports::",
    meaning: "The source's findings back up the article's claims. Most common.",
  },
  {
    prefix: "contradicts::",
    meaning:
      "The source disputes part of the article. Useful when you want to remember the disagreement.",
  },
  {
    prefix: "extends::",
    meaning: "The source builds on the article -- newer or deeper material.",
  },
  {
    prefix: "mentions::",
    meaning:
      "Passing reference. The article isn't the source's main subject but the source noted it.",
  },
  {
    prefix: "inspired-by::",
    meaning:
      "The article exists because of this source. Often a seed thought from 40-raw/plain/.",
  },
];

const lintRules: Array<{ id: string; severity: string; what: string }> = [
  {
    id: "missing-tldr",
    severity: "error",
    what: "Article body has no `## TL;DR` heading. Block re-compile until fixed.",
  },
  {
    id: "missing-sources",
    severity: "error",
    what: "Article body has no `## Sources` heading or the section has no items.",
  },
  {
    id: "missing-field:*",
    severity: "error / warn",
    what: "Required frontmatter fields. title and topic are errors; the rest are warnings.",
  },
  {
    id: "untyped-source",
    severity: "warn",
    what: "Sources list item that doesn't start with one of the 5 typed-edge prefixes.",
  },
  {
    id: "tldr-out-of-range",
    severity: "warn",
    what: "TL;DR word count is below 30 or above 150. Target is 50-100.",
  },
  {
    id: "stale-verified-at",
    severity: "info",
    what: "verified_at is older than 90 days. Surface for review, not blocking.",
  },
  {
    id: "staleness-signal-triggered",
    severity: "info",
    what: "Best-effort match -- the LLM noticed the staleness_signal mentions something it knows has changed.",
  },
];

export default function CortexFrontmatterPage() {
  return (
    <div className="iv-body-quattro grain bg-iv-cream pb-32">
      <div className="px-6 pt-10">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/ideaverse-os"
            className="inline-flex min-h-[44px] items-center gap-2 font-sans text-[13px] text-iv-teal hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-iv-amber"
          >
            <span aria-hidden>{"<--"}</span>
            ideaverse-os
          </Link>
        </div>
      </div>

      <section className="px-6 pt-10 pb-16 sm:pt-14 sm:pb-20">
        <div className="mx-auto max-w-3xl">
          <SectionLabel number="10" label="Cortex frontmatter" />
          <h1 className="mt-6 font-iv-display text-[clamp(2rem,5vw,3.25rem)] font-bold leading-[1.05] tracking-[-0.015em] text-iv-wine">
            Frontmatter the agent reads.
          </h1>
          <p className="mt-5 max-w-[42rem] text-[1.0625rem] leading-[1.65] text-iv-ink">
            Every article in{" "}
            <code className="font-mono text-[15px] text-iv-wine">
              10-cortex/
            </code>{" "}
            opens with a small set of YAML fields and ends with a typed list of
            sources. <code className="font-mono text-[15px] text-iv-wine">cortex-compile</code>{" "}
            writes them; <code className="font-mono text-[15px] text-iv-wine">cortex-lint</code>{" "}
            enforces them. This is the standard.
          </p>
        </div>
      </section>

      <section className="border-t border-iv-wine/15 px-6 pt-16 pb-20">
        <div className="mx-auto max-w-3xl">
          <SectionLabel number="20" label="Required fields" />
          <p className="mt-5 max-w-[42rem] text-[1.0625rem] leading-[1.65] text-iv-ink">
            Nine fields. Each one earns its place by changing how the LLM
            picks, ranks, or refreshes the article.
          </p>

          <div className="mt-8 overflow-hidden rounded-[2px] border border-iv-wine/15">
            <table className="w-full border-separate border-spacing-0">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="border-b border-iv-wine/15 bg-iv-cream-pale px-4 py-2.5 text-left font-sans text-[10.5px] font-medium uppercase tracking-[0.14em] text-iv-ink-soft"
                  >
                    Field
                  </th>
                  <th
                    scope="col"
                    className="border-b border-iv-wine/15 bg-iv-cream-pale px-4 py-2.5 text-left font-sans text-[10.5px] font-medium uppercase tracking-[0.14em] text-iv-ink-soft"
                  >
                    Type
                  </th>
                  <th
                    scope="col"
                    className="border-b border-iv-wine/15 bg-iv-cream-pale px-4 py-2.5 text-left font-sans text-[10.5px] font-medium uppercase tracking-[0.14em] text-iv-ink-soft"
                  >
                    Why it&apos;s there
                  </th>
                </tr>
              </thead>
              <tbody>
                {requiredFields.map((row, i) => (
                  <tr
                    key={row.field}
                    className={i % 2 === 0 ? "bg-iv-cream-pale" : "bg-iv-cream"}
                  >
                    <td className="border-t border-iv-wine/10 px-4 py-3 align-top font-mono text-[13px] text-iv-wine">
                      {row.field}
                    </td>
                    <td className="border-t border-iv-wine/10 px-4 py-3 align-top font-mono text-[12.5px] text-iv-ink-soft">
                      {row.type}
                    </td>
                    <td className="border-t border-iv-wine/10 px-4 py-3 align-top text-[14px] leading-[1.5] text-iv-ink-soft">
                      {row.why}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="border-t border-iv-wine/15 px-6 pt-16 pb-20">
        <div className="mx-auto max-w-3xl">
          <SectionLabel number="30" label="Typed-edge sources" />
          <p className="mt-5 max-w-[42rem] text-[1.0625rem] leading-[1.65] text-iv-ink">
            The Sources section uses five wikilink prefixes so the relationship
            between article and source is explicit. cortex-lint flags untyped
            sources as warnings.
          </p>

          <div className="mt-8 space-y-3">
            {edges.map((e) => (
              <div
                key={e.prefix}
                className="rounded-[2px] border border-iv-wine/15 bg-iv-cream-pale px-5 py-4"
              >
                <code className="font-mono text-[14px] font-semibold text-iv-wine">
                  {e.prefix}
                </code>
                <p className="mt-1 max-w-[40rem] text-[14px] leading-[1.5] text-iv-ink-soft">
                  {e.meaning}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-iv-wine/15 px-6 pt-16 pb-20">
        <div className="mx-auto max-w-3xl">
          <SectionLabel number="40" label="Example article" />
          <p className="mt-5 max-w-[42rem] text-[1.0625rem] leading-[1.65] text-iv-ink">
            What a clean cortex article looks like end-to-end.
          </p>

          <pre className="mt-6 overflow-x-auto rounded-[4px] border border-iv-wine/15 bg-iv-cream-pale px-5 py-4 font-mono text-[12.5px] leading-[1.55] text-iv-ink">
{`---
title: "Retrieval-augmented generation"
description: "Grounding LLM responses in your own documents. The standard architecture for memory-aware agents."
topic: "ai"
sources:
  - "40-raw/youtube/rag-explained.md"
  - "40-raw/papers/lewis-et-al-2020-rag.md"
created: 2026-04-12
last_compiled: 2026-05-08
verified_at: 2026-05-08
confidence: high
staleness_signal: "RAG architecture moves to graph-RAG by default, or vector DBs are replaced by long-context models"
---

# Retrieval-augmented generation

LLMs answer better when they retrieve relevant documents first.

## TL;DR

RAG pairs an LLM with a retriever that fetches relevant chunks from your own
corpus before generation. The model's response is grounded in real documents
instead of pure parametric memory, which reduces hallucination and lets you
update knowledge without retraining. Cost: retrieval quality is now your
bottleneck.

## Summary

[2-3 paragraphs.]

## Key Facts

- Lewis et al. (2020) introduced the term, pairing BART with a dense retriever.
- Modern stacks pick top-k chunks via embedding similarity, then concatenate.
- Retrieval quality dominates response quality once the LLM is good enough.

## Connections

- Related: [[10-cortex/ai/embeddings]], [[10-cortex/ai/long-context]]
- Used in: vault-side memory loop (cortex-compile + cortex-connect)
- Contrasts with: [[10-cortex/ai/finetuning]] -- finetuning bakes knowledge in;
  RAG keeps it swappable.

## Sources

- supports:: [[40-raw/papers/lewis-et-al-2020-rag.md]] -- original architecture description
- extends:: [[40-raw/youtube/rag-explained.md]] -- modern stack walkthrough (top-k, reranking, hybrid search)
`}
          </pre>
        </div>
      </section>

      <section className="border-t border-iv-wine/15 px-6 pt-16 pb-20">
        <div className="mx-auto max-w-3xl">
          <SectionLabel number="50" label="cortex-lint rules" />
          <p className="mt-5 max-w-[42rem] text-[1.0625rem] leading-[1.65] text-iv-ink">
            Read-only diagnostic. Run{" "}
            <code className="font-mono text-[15px] text-iv-wine">
              /cortex-lint
            </code>{" "}
            to surface decay and drift across{" "}
            <code className="font-mono text-[15px] text-iv-wine">
              10-cortex/
            </code>
            . Never mutates a file; the report is for you to read and act on.
          </p>

          <div className="mt-8 overflow-hidden rounded-[2px] border border-iv-wine/15">
            <table className="w-full border-separate border-spacing-0">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="border-b border-iv-wine/15 bg-iv-cream-pale px-4 py-2.5 text-left font-sans text-[10.5px] font-medium uppercase tracking-[0.14em] text-iv-ink-soft"
                  >
                    Rule
                  </th>
                  <th
                    scope="col"
                    className="border-b border-iv-wine/15 bg-iv-cream-pale px-4 py-2.5 text-left font-sans text-[10.5px] font-medium uppercase tracking-[0.14em] text-iv-ink-soft"
                  >
                    Severity
                  </th>
                  <th
                    scope="col"
                    className="border-b border-iv-wine/15 bg-iv-cream-pale px-4 py-2.5 text-left font-sans text-[10.5px] font-medium uppercase tracking-[0.14em] text-iv-ink-soft"
                  >
                    What it catches
                  </th>
                </tr>
              </thead>
              <tbody>
                {lintRules.map((row, i) => (
                  <tr
                    key={row.id}
                    className={i % 2 === 0 ? "bg-iv-cream-pale" : "bg-iv-cream"}
                  >
                    <td className="border-t border-iv-wine/10 px-4 py-3 align-top font-mono text-[13px] text-iv-wine">
                      {row.id}
                    </td>
                    <td className="border-t border-iv-wine/10 px-4 py-3 align-top font-mono text-[12.5px] text-iv-ink-soft">
                      {row.severity}
                    </td>
                    <td className="border-t border-iv-wine/10 px-4 py-3 align-top text-[14px] leading-[1.5] text-iv-ink-soft">
                      {row.what}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
