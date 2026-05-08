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
  summary: string;
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
    label: 'terminal memory',
    category: 'DAILY RECALL AGENT',
    summary: 'End your session with tomorrow\'s starting point.',
    command: 'afterglow --today',
    output: ['generating digest…', 'memories captured', 'plan for tomorrow'],
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
    label: 'decision clarity',
    category: 'NOTE CLARITY ENGINE',
    summary: 'Extract the real decision from messy notes, transcripts, and plans.',
    command: 'unfog notes/',
    output: ['scanning notes…', 'decision shape found', 'next action extracted'],
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
    summary: 'Find hidden prompt conflicts before they become model failures.',
    command: 'promptglass watch',
    output: ['observing session…', 'conflicts surfaced', 'repair notes queued'],
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
    summary: 'Pixel-cosmic experiments, motion logos, and symbolic interface studies.',
    command: 'kairos lab list',
    output: ['experiments indexed', 'orbital sketches active', 'interface studies queued'],
    metrics: [
      { name: 'MODE', value: 'LAB' },
      { name: 'SIGNAL', value: 'VISUAL' },
      { name: 'STATE', value: 'OPEN' },
    ],
  },
];
