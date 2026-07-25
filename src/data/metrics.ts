export interface MetricSignal {
  label: string;
  value: string;
  icon: string;
  chart: 'bars' | 'line';
}

// Live-ish — update when projects ship or new experiments land.
export const metricSignals: MetricSignal[] = [
  { label: 'PROJECTS', value: '4', icon: '</>', chart: 'line' },
  { label: 'LIVE SYSTEMS', value: '2', icon: '◇', chart: 'bars' },
  { label: 'EXPERIMENTS', value: '3', icon: '::', chart: 'line' },
  { label: 'BUILDING', value: 'MORE', icon: '◌', chart: 'bars' },
];
