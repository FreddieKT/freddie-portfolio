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

export const projects: Project[] = [
  {
    index: '01',
    slug: 'kairos-daydreamer',
    title: 'KAIROS DAYDREAMER',
    label: 'idea collision agent',
    category: 'PERSONAL KNOWLEDGE LAB',
    date: '2026-05-16',
    publisher: 'Freddie K.',
    summary: 'A local, approval-gated daydreaming system that turns a curated corpus into compact idea-collision briefs.',
    problem: 'Good ideas often hide between old notes, project fragments, and unfinished thoughts. Normal search finds matching words, but it rarely finds the strange connection that makes a project move.',
    does: 'Kairos Daydreamer indexes a safe local corpus, ranks relevant fragments, generates a short collision brief, and waits for Freddie to keep, expand, reject, or export the result. It stays manual-first: no background runs, no auto-posting, and no writes to private notes without approval.',
    stack: ['Hermes Agent', 'local corpus index', 'hybrid ranking', 'approval workflow', 'SVG/HTML visualization'],
    status: 'local manual lab',
    nextStep: 'Prepare a demo-safe corpus and publish one sanitized Daydreamer run as the first portfolio case study.',
    command: 'kairos-daydream --mode daydream --query "agent dreaming"',
    output: ['safe corpus indexed', 'collision brief generated', 'approval decision pending', 'visual export available'],
    metrics: [
      { name: 'MODE', value: 'LOCAL' },
      { name: 'SIGNAL', value: 'IDEA' },
      { name: 'STATE', value: 'LAB' },
    ],
  },
];
