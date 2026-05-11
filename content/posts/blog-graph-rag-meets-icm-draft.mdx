---
title: "Graph RAG Meets ICM: A Strategy for Enterprise Knowledge at Scale"
date: 2026-03-26
tags: ["agentic-engineering", "ai", "rag", "enterprise"]
summary: "Traditional RAG falls apart when your codebase spans hundreds of repos. Graph RAG fixes retrieval — ICM fixes the workflow around it. Here's how to combine them."
ShowToc: true
---

## The Problem with Flat Retrieval

If you've built a RAG pipeline before, you know the pattern: chunk your documents, embed them as vectors, store them in a database, and retrieve the closest matches when a query comes in.

This works fine when your knowledge base is small — a handful of docs, a single repo, one team's wiki. But at enterprise scale, flat retrieval breaks down.

Say you ask: *"What happens if I change the user schema in the auth service?"*

A traditional RAG pipeline finds chunks that mention "user schema" and "auth service." It returns code snippets and maybe a doc page. But it has no idea that the billing service reads from that schema, that three downstream consumers depend on it, or that a migration script needs to run first.

The chunks are isolated. There's no understanding of **how things connect**.

---

## What Graph RAG Actually Is

Graph RAG replaces the flat chunk-and-embed approach with a **knowledge graph** — a web of entities and relationships.

Instead of:
```
Document → Chunks → Vectors → Similarity Search
```

You get:
```
Document → Entities + Relationships → Graph Database → Traversal + Search
```

An LLM reads your documents and extracts **entities** (services, functions, teams, APIs, schemas) and **relationships** between them (calls, depends-on, owns, deploys-to). These get stored as nodes and edges in a graph database like Neo4j.

When a query comes in, the system traverses the graph to find not just what matches — but what's **connected** to what matches.

| Query | Traditional RAG Returns | Graph RAG Returns |
|-------|------------------------|-------------------|
| "What calls PaymentService?" | Code where PaymentService is defined | Every service, endpoint, and cron job that calls it |
| "Impact of changing user schema?" | Chunks mentioning "user schema" | The full dependency chain — consumers, migrations, tests affected |
| "How does auth work end-to-end?" | Random auth-related snippets | Connected path: login → middleware → token validation → session store |

The difference is structural awareness. Graph RAG understands your architecture, not just your text.

---

## Where ICM Comes In

Graph RAG solves the *retrieval* problem. But building and maintaining a Graph RAG pipeline is its own beast — entity extraction, graph construction, hybrid querying, validation, ongoing updates as code changes.

This is where **Interpretive Context Methodology (ICM)** fits.

ICM is a framework from a [research paper](https://github.com/RinDig/Model-Workspace-Protocol-MWP-) by Jake Van Clief and David McDermott. The core idea: instead of building complex multi-agent systems, use **folder structure and plain-text files** as your agent architecture. Each folder is a stage. Each stage has a contract. The AI reads the right folder, does one job, and writes output for the next stage.

Five principles drive it:

1. **One Stage, One Job** — don't combine steps
2. **Plain Text as Interface** — markdown files, no proprietary formats
3. **Layered Context Loading** — each stage only sees what it needs
4. **Every Output Is an Edit Surface** — review between stages
5. **Configure the Factory, Not the Product** — set up once, run repeatedly

These principles solve the exact pain points of enterprise Graph RAG pipelines: they're complex, hard to debug, and nobody can see what's happening inside them.

---

## The Combined Strategy: Graph RAG + ICM Pipeline

Here's how I'd structure a Graph RAG system using ICM's stage-based approach:

```
graph-rag-pipeline/
├── _config/
│   ├── entity-types.md        # What entities to extract (services, APIs, schemas...)
│   ├── relationship-types.md  # What relationships to track (calls, depends-on, owns...)
│   └── graph-conventions.md   # Naming, deduplication rules
│
├── 01_ingest/
│   ├── CONTEXT.md             # Contract: read source docs, output clean text
│   ├── references/
│   └── output/                # Cleaned, normalized documents
│
├── 02_extract/
│   ├── CONTEXT.md             # Contract: extract entities + relationships from text
│   ├── references/
│   │   └── extraction-prompt.md  # The prompt template for entity extraction
│   └── output/                # Entity-relationship pairs as markdown tables
│
├── 03_construct/
│   ├── CONTEXT.md             # Contract: build graph from extracted pairs
│   ├── references/
│   └── output/                # Graph database load scripts or Cypher queries
│
├── 04_validate/
│   ├── CONTEXT.md             # Contract: check graph quality, find orphans, duplicates
│   ├── references/
│   └── output/                # Validation report + suggested fixes
│
├── 05_query/
│   ├── CONTEXT.md             # Contract: hybrid retrieval (graph + vector)
│   ├── references/
│   │   └── query-patterns.md  # Common query templates
│   └── output/                # Query results with provenance
│
├── IDENTITY.md
└── CONTEXT.md
```

### What Each Stage Does

**Stage 1 — Ingest:** Pull in source material (code, docs, wikis, API specs). Clean and normalize it. Output is plain markdown. A human can review what went in before extraction starts.

**Stage 2 — Extract:** An LLM reads the cleaned docs and pulls out entities and relationships using the prompt template in `references/`. Output is structured markdown tables — completely readable, editable, and auditable.

**Stage 3 — Construct:** Transform the extracted pairs into graph database operations. This stage is mechanical — it reads the tables and generates Cypher queries (for Neo4j) or equivalent. The human reviews the queries before they run.

**Stage 4 — Validate:** Run quality checks on the graph. Find orphan nodes (entities with no relationships), duplicate entities, missing connections. Output a report the human can act on.

**Stage 5 — Query:** The live retrieval stage. Combines graph traversal with optional vector search for a hybrid approach. Query patterns live in `references/` so they're transparent and editable.

### Why This Works for Enterprise

**Auditability.** Every stage's output is a markdown file you can open and read. When the graph has a bad entity or a wrong relationship, you can trace it back to exactly which stage produced it and which input caused it. Try doing that with a monolithic pipeline.

**Human checkpoints.** Enterprise teams don't ship things they can't review. ICM puts a human gate between every stage. The extraction looks wrong? Edit the output before construction. The graph has duplicates? Fix them in the validation report before moving on.

**Repeatability.** When new code gets merged or docs get updated, you re-run the same pipeline. The `_config/` files (entity types, relationship types, conventions) stay stable. Only the inputs change.

**Focused context.** Each stage loads only what it needs. The extraction stage doesn't need to know about query patterns. The validation stage doesn't need the raw source docs. This keeps each LLM call focused and accurate — the same "Lost in the Middle" research that ICM was designed around.

---

## When to Start

You don't need hundreds of repos to benefit from this. Start when:

- **Grep stops working** — you can't find what you need with keyword search alone
- **Onboarding takes weeks** — new engineers can't understand how services connect
- **Impact analysis is manual** — someone has to trace dependencies by hand before making changes

The graph doesn't have to be perfect on day one. Run the pipeline once, review each stage, fix what's wrong, run it again. That's the whole point of ICM — the pipeline improves with each iteration because every output is editable.

---

## The Stack I'd Recommend

| Component | Tool | Why |
|-----------|------|-----|
| Graph database | Neo4j or FalkorDB | Neo4j for full enterprise, FalkorDB for lighter setups |
| Entity extraction | Claude or GPT-4 via prompt template | LLM reads docs and outputs structured entity-relationship pairs |
| Vector search (hybrid) | pgvector or Pinecone | For combining semantic search with graph traversal |
| Pipeline orchestration | ICM folder structure | Plain text, auditable, human-in-the-loop |
| Query layer | LangChain Graph Chains or custom | Translates natural language to Cypher + vector queries |

---

## What This Isn't

This isn't a replacement for simple RAG. If you have a small knowledge base — a few dozen docs, a single codebase — file search or basic vector RAG is enough. Don't over-engineer it.

This also isn't a real-time system. Graph construction takes time. ICM is built for sequential, reviewable workflows — not live multi-agent orchestration.

But if you're working at scale, across teams and repos, and you need your AI agents to actually understand how your systems connect — this is the architecture worth building toward.

---

*Inspired by recent discussion on [AI agent SDKs vs frameworks](https://www.youtube.com/watch?v=gmaHRwijOXs) and the [ICM research paper](https://github.com/RinDig/Model-Workspace-Protocol-MWP-).*
