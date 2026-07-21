export interface ProjectMetric { name: string; value: string; }

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
    slug: 'pos-starter-kit',
    title: 'POS STARTER KIT',
    label: 'multi-tenant point-of-sale',
    category: 'SAAS',
    date: '2026-06-19',
    publisher: 'Freddie K.',
    summary: 'A multi-tenant POS system with barcode scanning, bulk CSV import, and receipt printing — built for small logistics businesses.',
    problem: 'Small freight and logistics companies need a simple POS but most options are bloated, expensive, or require internet that isn\'t always there.',
    does: 'Handles product scanning, cart management, receipt printing, and multi-company tenant isolation. k6 load tested at 150 concurrent users.',
    stack: ['TypeScript', 'React', 'Supabase', 'k6'],
    status: 'production-ready — load tested',
    nextStep: 'Onboard first external tenant and iterate on feedback.',
    command: 'npm run dev',
    output: ['multi-tenant routing active', 'scan → cart → print flow complete', 'k6: 150 VU passed'],
    metrics: [
      { name: 'TENANTS', value: 'MULTI' },
      { name: 'LOAD TEST', value: '150 VU' },
      { name: 'STATE', value: 'SHIPPING' },
    ],
  },
  {
    index: '02',
    slug: 'ktm-cargo',
    title: 'KTM CARGO',
    label: 'cross-border freight system',
    category: 'LOGISTICS',
    date: '2026-06-08',
    publisher: 'Freddie K.',
    summary: 'A complete operations system for a cross-border freight business — order tracking, shopping orders, and carrier management.',
    problem: 'Managing cross-border freight involves juggling orders, carriers, shopping lists, and customer updates across multiple channels. Spreadsheets break fast.',
    does: 'Centralizes order intake, tracks shipments, manages shopping orders, and provides an ops dashboard for daily logistics work.',
    stack: ['TypeScript', 'React', 'Supabase', 'PostgreSQL'],
    status: 'live — active daily use',
    nextStep: 'Expand dashboard with carrier analytics and automated customer notifications.',
    command: 'npm run dev',
    output: ['orders flowing', 'ops dashboard live', 'shopping orders tracked'],
    metrics: [
      { name: 'STATUS', value: 'LIVE' },
      { name: 'USERS', value: 'ACTIVE' },
      { name: 'TYPE', value: 'OPS' },
    ],
  },
  {
    index: '03',
    slug: 'paperclip',
    title: 'PAPERCLIP',
    label: 'AI agent orchestration',
    category: 'AI INFRASTRUCTURE',
    date: '2026-05-20',
    publisher: 'Freddie K.',
    summary: 'An open-source platform for orchestrating AI agents — think of it as a conductor for multiple AI workers that can collaborate on complex tasks.',
    problem: 'Running multiple AI agents together is messy. Most setups require manual coordination, and agents often step on each other.',
    does: 'Provides a dashboard to spawn, monitor, and coordinate AI agents. Supports parallel workstreams, approval gates, and result aggregation.',
    stack: ['TypeScript', 'Next.js', 'pnpm', 'Hermes Agent', 'MCP'],
    status: 'active development',
    nextStep: 'Ship first stable release with agent lifecycle management.',
    command: 'pnpm dev',
    output: ['orchestrator running', 'agent pools active', 'dashboard live on localhost:3100'],
    metrics: [
      { name: 'STATE', value: 'BUILDING' },
      { name: 'AGENTS', value: 'POOLED' },
      { name: 'LICENSE', value: 'OPEN' },
    ],
  },
  {
    index: '04',
    slug: 'kairos-daydreamer',
    title: 'KAIROS DAYDREAMER',
    label: 'idea collision agent',
    category: 'PERSONAL KNOWLEDGE LAB',
    date: '2026-05-16',
    publisher: 'Freddie K.',
    summary: 'A local, approval-gated system that turns a curated corpus of notes and ideas into compact collision briefs — like a creativity engine for your own brain.',
    problem: 'Good ideas often hide between old notes, project fragments, and unfinished thoughts. Regular search finds matching words, but rarely the strange connections that move a project forward.',
    does: 'Indexes a local corpus, ranks relevant fragments, generates a short collision brief, and waits for approval before doing anything. Manual-first: no background runs, no auto-posting.',
    stack: ['Hermes Agent', 'local index', 'hybrid ranking', 'approval workflow'],
    status: 'local manual lab',
    nextStep: 'Prepare a demo-safe corpus and publish one sanitized Daydreamer run as a case study.',
    command: 'kairos-daydream --mode daydream --query "agent dreaming"',
    output: ['corpus indexed', 'collision brief generated', 'approval pending', 'visual export ready'],
    metrics: [
      { name: 'MODE', value: 'LOCAL' },
      { name: 'SIGNAL', value: 'IDEA' },
      { name: 'STATE', value: 'LAB' },
    ],
  },
];
