export interface MetricSignal {
  label: string;
  value: string;
  icon: string;
  chart: 'bars' | 'line';
}

// Prototype indicators only. These are deliberately not live or verified stats.
export const metricSignals: MetricSignal[] = [
  { label: 'TOOLS BUILT', value: '4', icon: '</>', chart: 'line' },
  { label: 'EXPERIMENTS', value: 'OPEN', icon: '◇', chart: 'bars' },
  { label: 'PROTOTYPE SIGNALS', value: 'STATIC', icon: '::', chart: 'line' },
  { label: 'SYSTEM STATUS', value: 'BUILDING', icon: '◌', chart: 'bars' },
];
