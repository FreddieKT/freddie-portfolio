---
title: "On shipping small tools that stay useful"
date: "2026-04-22"
summary: "Most side projects die because they try to become products. The ones that survive stay small, solve one thing precisely, and resist the urge to grow."
tags: ["Building", "Philosophy", "Tools"]
---

I've been building small tools for about three years. Most of them are dead — abandoned after a few weeks when the initial excitement faded and the maintenance cost became real. A few of them are still running, still useful, still something I open regularly.

The difference isn't quality. The surviving tools aren't better built than the dead ones. The difference is scope.

## What small actually means

Small doesn't mean simple. It means bounded. A small tool does one thing and has a clear opinion about what's outside its scope.

A notes app that syncs across devices, supports markdown, has tags, allows sharing, and integrates with your calendar is not a small tool — it's a small product. A notes app that creates a single plain text file in a fixed location every day is a small tool. The second one is easier to build, easier to maintain, and more likely to still be running in two years.

The boundary isn't arbitrary. It's the thing that prevents scope creep. When someone asks "could you add X?" the answer is always "X is out of scope for this tool." You can't say that without having a scope.

## The feature request trap

Every useful tool attracts feature requests. Some of them are good ideas. The trap is that even good ideas can kill a small tool by turning it into something that requires real maintenance.

The features that feel most compelling to add are usually the ones that would make the tool useful to more people. More people means more feature requests. More feature requests means more decisions about scope. More scope decisions means the tool is now a product, and you're now a product manager for something you built for yourself on a Sunday afternoon.

The discipline: build the tool for the problem you actually have, not the problem you might have, not the problem someone else has. If someone else wants a version of your tool for their problem, they can fork it.

## Why most side projects die

The typical arc: build something useful, share it, get feedback, implement feedback, get more feedback, implement more feedback, realize you're spending five hours a week maintaining something you built in a weekend, abandon it.

The mistake happens at "share it." Not that sharing is wrong — sharing is good. The mistake is treating the feedback as a roadmap rather than information.

Other people's problems are interesting. They're not your responsibility. You can learn from what people want without building what they want.

## The maintenance question

Before adding anything to a tool, I ask: will I want to maintain this in six months?

Not "is this useful?" — tools are always useful to someone. Not "is this technically interesting?" — that fades. The question is specifically about maintenance burden, because maintenance is what separates a working tool from an abandoned repo.

Features that are easy to maintain: configuration options that change behavior without adding code paths. Features that are hard to maintain: integrations with external services, complex state management, UI that users interact with directly.

The tools that survive are usually CLI tools with no UI, or single-page web apps with no backend, or scripts that run locally and have no dependencies that can break. The tools that die are usually apps with external dependencies, authentication, and data storage.

## The right size

The right size for a personal tool is: the minimum needed to solve the problem you actually have, with enough care in the implementation that you're not embarrassed to look at the code six months later.

No more, no less.

When a tool wants to grow, the right question isn't "should I build this feature?" It's "is this still the same tool, or is it becoming a different tool?" If it's becoming a different tool, start a new repo. Keep the old one small. Let them be separate things with separate scopes.

Most of the tools I use daily are embarrassingly small — a few hundred lines of code, one input, one output, no configuration. They're still running because there's almost nothing that can break.

## What this means for Afterglow, Unfog, and the rest

The projects on this portfolio are all small tools by design. Each one does one thing:

- **Afterglow** — generates an end-of-day digest. That's it.
- **Unfog** — extracts a decision from a messy input. That's it.
- **PromptGlass** — observes prompt drift. That's it.

None of them are trying to become platforms. None of them have user accounts, or billing, or integrations, or dashboards. The moment any of them would benefit from those things, they've outgrown the small-tool model and become something else. That's fine — but it means building something new, not extending something old.

The value of keeping them small isn't laziness. It's that small tools have a realistic chance of being maintained and used for years. Large tools have a realistic chance of being abandoned in months.
