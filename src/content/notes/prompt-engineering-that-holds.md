---
title: "Prompt engineering that holds under real-world conditions"
date: "2026-04-28"
publisher: "KTT.DEV"
summary: "Most prompt advice is optimized for demos. Production prompts face adversarial inputs, model drift, edge cases, and context limits. Here's what actually works."
tags: ["AI", "Prompts", "Engineering"]
---

Prompt engineering has a reputation problem. The techniques that make demos look impressive — chain-of-thought, few-shot examples, elaborate system prompts — often degrade under real usage. Users don't behave like examples. Context windows fill up. Models get updated. What worked in March breaks in April.

Here's what I've learned building prompts that are meant to last.

## The demo/production gap

Demo prompts optimize for one thing: looking impressive on the first try with a well-formed input. Production prompts need to handle:

- Inputs that don't match any of your few-shot examples
- Users who ignore instructions and do unexpected things
- Context windows that fill up after 20 turns of conversation
- The same query meaning different things in different contexts
- Model updates that change behavior without notice

The gap is real and most prompt engineering advice ignores it.

## Principle 1: Constraints over instructions

"Be concise" is an instruction. "Respond in under 100 words" is a constraint. Instructions describe desired behavior. Constraints define hard limits.

Instructions fail when the model's interpretation of "concise" doesn't match yours. Constraints fail only when the model ignores them entirely — which is easier to catch and fix.

Build prompts around constraints wherever possible:

```
BAD:  "Be professional and avoid jargon"
GOOD: "Use plain language. Avoid terms that require domain knowledge to understand. 
       If you must use a technical term, define it in the same sentence."
```

The second version is still an instruction, but it's more constrained — it specifies what to do when the constraint can't be fully met.

## Principle 2: Structure inputs, not just outputs

Most prompt advice focuses on structuring the output format. But structuring the input format is equally important and often overlooked.

When you control how inputs are formatted, you reduce ambiguity before the model even starts reasoning:

```
User: summarize this document
→ Ambiguous. Summarize for whom? At what length? For what purpose?

User: [DOCUMENT]: ... [AUDIENCE]: technical engineers [FORMAT]: 3 bullet points [LENGTH]: under 80 words
→ Constrained. The model has what it needs.
```

If you can't control user input format, parse and reformat before passing to the model. A small extraction step that structures raw input before the main prompt dramatically improves consistency.

## Principle 3: Failure modes are features

Every prompt has predictable failure modes. Find them deliberately. The way to find them: write tests.

Not unit tests in the software sense — input/output pairs that represent edge cases:

```
Test 1: Empty input → should return specific error message, not hallucinate content
Test 2: Input in wrong language → should detect and respond appropriately
Test 3: Input that contradicts the system prompt → should follow system prompt
Test 4: Input much longer than training examples → should not truncate silently
Test 5: Adversarial input designed to override instructions → should resist
```

Run these tests every time you change the prompt. Run them again after any model update. The goal isn't a perfect prompt — it's knowing exactly where your prompt breaks.

## Principle 4: Shorter system prompts are more robust

Long system prompts feel safer because they cover more cases. In practice, they're more fragile because:

1. Models attend less to instructions buried deep in a long prompt
2. Contradictions between instructions are harder to spot
3. Token budget consumed by instructions isn't available for context
4. When the model does something wrong, it's harder to diagnose which instruction failed

The discipline: every sentence in a system prompt should be justified by a real failure you've observed. If you're adding instructions preemptively, you're probably adding noise.

## Principle 5: Model drift is real — version your prompts

LLM providers update models without always announcing breaking changes. A prompt that worked perfectly on `gpt-4-turbo-2024-04-09` may behave differently on a later version.

The mitigation: treat prompt files as versioned artifacts. Use filenames like `summarize-v1.2.txt`. Keep a changelog. When something breaks after a model update, you can diff the behavior against a known-good version.

This seems like overhead until it saves you two hours of debugging why your production prompt started returning different output.

## What actually works in the long run

The prompts that survive production aren't clever. They're:

- **Short** — every word is there because removing it broke something
- **Constrained** — hard limits rather than soft suggestions
- **Tested** — against known failure modes on a schedule
- **Versioned** — so changes are deliberate and reversible
- **Observable** — structured output that lets you monitor for drift

The prompts that fail are elaborate, aspirational, and optimized for the best-case user. Build for the worst-case user and the best case takes care of itself.
