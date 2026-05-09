export interface ProjectMetric {
  name: string;
  value: string;
}

export interface Project {
  index: string;
  slug: string;
  title: string;
  label: string;
  category: string;
  date: string;
  publisher: string;
  summary: string;
  problem: string;
  does: string;
  stack: string[];
  status: string;
  nextStep: string;
  command: string;
  output: string[];
  metrics?: ProjectMetric[];
}

// Prototype indicators only. These are not live or verified portfolio metrics.
export const projects: Project[] = [
  {
    index: '01',
    slug: 'afterglow',
    title: 'AFTERGLOW',
    label: 'session continuity',
    category: 'DAILY RECALL AGENT',
    date: '2026-05-09',
    publisher: 'KTT.DEV',
    summary: 'A session recap tool that gives tomorrow a clean starting point.',
    problem: 'Good work gets lost when a session ends with half-finished notes, scattered context, and no clear next move.',
    does: 'Afterglow turns the end of a work session into a short digest: what changed, what matters, and what to pick up next.',
    stack: ['AI workflows', 'memory systems', 'terminal UX'],
    status: 'concept build',
    nextStep: 'Test it on real project sessions and tighten what the recap should remember or ignore.',
    command: 'afterglow --today',
    output: ['session digest drafted', 'important context saved', 'next start point ready'],
    metrics: [
      { name: 'MODE', value: 'CONCEPT' },
      { name: 'SIGNAL', value: 'MEMORY' },
      { name: 'STATE', value: 'BUILD' },
    ],
  },
  {
    index: '02',
    slug: 'unfog',
    title: 'UNFOG',
    label: 'decision extraction',
    category: 'NOTE CLARITY ENGINE',
    date: '2026-05-09',
    publisher: 'KTT.DEV',
    summary: 'A note parser for finding the real decision inside messy thinking.',
    problem: 'Long notes often hide the actual decision under context, tangents, and maybe-later ideas.',
    does: 'Unfog scans notes or transcripts and pulls out the decision, the reason behind it, and the next action.',
    stack: ['LLM prompts', 'structured extraction', 'knowledge workflows'],
    status: 'concept build',
    nextStep: 'Define a stricter output schema so the tool separates decisions from ordinary summaries.',
    command: 'unfog notes/',
    output: ['notes scanned', 'decision found', 'next action extracted'],
    metrics: [
      { name: 'MODE', value: 'CONCEPT' },
      { name: 'SIGNAL', value: 'CLARITY' },
      { name: 'STATE', value: 'BUILD' },
    ],
  },
  {
    index: '03',
    slug: 'promptglass',
    title: 'PROMPTGLASS',
    label: 'prompt linting',
    category: 'PROMPT OBSERVER',
    date: '2026-05-09',
    publisher: 'KTT.DEV',
    summary: 'A prompt linting tool for catching conflicts before the model does something weird.',
    problem: 'Prompt problems are hard to see until the model fails: conflicting rules, unclear priority, stale examples, and hidden assumptions.',
    does: 'Promptglass watches prompts like code and points out conflicts, vague instructions, and repair notes before they hit production.',
    stack: ['prompt engineering', 'evaluation', 'developer tooling'],
    status: 'concept build',
    nextStep: 'Turn the lint rules into repeatable checks and test them against real prompt files.',
    command: 'promptglass watch',
    output: ['prompt checked', 'conflicts surfaced', 'repair notes queued'],
    metrics: [
      { name: 'MODE', value: 'CONCEPT' },
      { name: 'SIGNAL', value: 'PROMPTS' },
      { name: 'STATE', value: 'BUILD' },
    ],
  },
  {
    index: '04',
    slug: 'kairos-lab',
    title: 'KAIROS LAB',
    label: 'visual systems',
    category: 'EXPERIMENTAL SYSTEMS',
    date: '2026-05-09',
    publisher: 'KTT.DEV',
    summary: 'A visual lab for pixel-cosmic interface studies, motion tests, and symbolic UI ideas.',
    problem: 'Some interface ideas are easier to feel than explain. They need sketches, motion, and weird visual constraints before they become usable design language.',
    does: 'KAIROS Lab collects pixel art, orbital layouts, motion studies, and small interface experiments around the KTT.DEV visual system.',
    stack: ['p5.js', 'CSS motion', 'visual design systems'],
    status: 'active lab',
    nextStep: 'Separate the strongest studies into reusable design patterns instead of one-off visuals.',
    command: 'kairos lab list',
    output: ['experiments indexed', 'orbital sketches active', 'interface studies queued'],
    metrics: [
      { name: 'MODE', value: 'LAB' },
      { name: 'SIGNAL', value: 'VISUAL' },
      { name: 'STATE', value: 'OPEN' },
    ],
  },
];
