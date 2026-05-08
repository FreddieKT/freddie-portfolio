---
title: "Building AI memory systems that actually work in production"
date: "2026-05-03"
summary: "Most AI memory implementations fail because they treat memory as retrieval. Real memory is about what gets recorded, what gets forgotten, and what gets surfaced at the right time."
tags: ["AI", "Systems", "Memory"]
---

Memory is the hardest part of building useful AI workflows. Not because the technology is hard — vector databases, embeddings, and retrieval pipelines are well-understood. Memory is hard because most implementations get the model wrong. They build retrieval systems and call them memory systems.

## The difference between retrieval and memory

A retrieval system answers the question: "Given this query, what stored content is most similar?"

A memory system answers a different question: "Given what I know about this context, what should I surface right now — and what should I keep quiet?"

Retrieval is symmetric: the query determines what comes back. Memory is asymmetric: the system has opinions about what's important, what's stale, and what the user doesn't need to be reminded of.

This distinction matters because retrieval-based "memory" has failure modes that pure retrieval doesn't:

- **Over-surfacing**: The user asked a question about Python. The system surfaces every Python fact it has ever stored. Accurate, but useless.
- **Temporal blindness**: A fact from six months ago is weighted equally with something from yesterday. Context is lost.
- **No forgetting**: Real memory compresses and discards. Retrieval systems keep everything.

## A minimal memory model

The model I use for personal AI tools has three layers:

**Working memory** — what's active right now. Implemented as the current conversation context. No storage needed; it exists in the prompt window. Should be aggressively managed to stay relevant.

**Session memory** — what happened in the last few sessions. Stored as structured summaries, not raw transcripts. Updated at session end. Covers roughly 7–14 days. The Afterglow project generates these automatically.

**Long-term memory** — patterns, preferences, and facts that don't expire. Stored in a vector database, but only after explicit capture. Not everything gets here automatically.

The key insight: **not everything gets promoted**. Working memory gets summarized, not verbatim-saved. Sessions get compressed before entering long-term storage. The model decides what's worth keeping.

## What to store

The biggest mistake is storing conversations. Conversations are the raw material, not the output. What's worth storing:

- **Decisions made** — not the deliberation, just the outcome and the reason. "Chose SQLite over Postgres because this is a single-user tool."
- **Preferences established** — stable facts about how the user thinks. "Prefers short function names. Dislikes deeply nested conditionals."
- **Facts about the domain** — project-specific context that an AI assistant wouldn't otherwise know. "The user's main project is a terminal memory tool called Afterglow."
- **Corrections** — when the AI got something wrong and the user corrected it. These are the highest-value memory entries.

Conversations, exploratory exchanges, and successful tasks where nothing surprising happened: these don't need to be stored.

## The forgetting problem

Human memory forgets actively — it's not a bug, it's how the system stays useful. AI memory systems that never discard anything become cluttered with stale context that degrades answer quality.

A simple forgetting model:

1. **Time-based decay**: Memory items older than 30 days that haven't been accessed get flagged for review.
2. **Supersession**: When a new fact directly contradicts a stored fact, the old one is removed, not kept alongside.
3. **Compression**: A collection of related facts gets compressed into a summary. Ten notes about "user prefers X" become one strong signal.

Implementing this perfectly is hard. A simple first step: add a `last_accessed` timestamp to every memory entry and stop surfacing anything that hasn't been accessed in 60 days.

## Practical implementation

For a personal tool, you don't need a full vector database to start. A flat JSON file with structured entries and simple keyword search gets you 80% of the value with 5% of the complexity.

```json
{
  "memories": [
    {
      "id": "mem_001",
      "type": "preference",
      "content": "Prefers TypeScript over JavaScript for new projects",
      "created": "2026-04-01",
      "last_accessed": "2026-05-09",
      "confidence": 0.95
    },
    {
      "id": "mem_002",
      "type": "decision",
      "content": "Using Astro for portfolio — static generation, no framework lock-in",
      "created": "2026-05-01",
      "last_accessed": "2026-05-09",
      "confidence": 1.0
    }
  ]
}
```

The `confidence` field matters more than it looks. When a preference is observed once, confidence is 0.6. Each confirmation raises it. Each contradiction lowers it. At 0.3, the memory gets flagged for deletion.

## What good memory feels like

When a memory system is working correctly, the AI assistant feels less like a search engine and more like a colleague. It doesn't remind you of things you already know. It surfaces relevant context before you ask. It remembers what you said last week without you repeating yourself.

The failure mode to avoid: an assistant that dumps everything it knows about a topic every time that topic comes up. That's not memory — that's retrieval with extra steps. Real memory is selective, temporal, and opinionated about what matters right now.
