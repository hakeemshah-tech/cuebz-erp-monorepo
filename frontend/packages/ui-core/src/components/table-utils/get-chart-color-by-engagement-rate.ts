/**
 * Hex colour for a chart series keyed to the same engagement bands used by
 * `getEngagementRate`, so table text and chart marks stay consistent.
 */
export function getChartColorByEngagementRate(value: number | string): string {
  const rate = Number(value) || 0;
  if (rate >= 40) return "#16a34a";
  if (rate >= 20) return "#d97706";
  return "#dc2626";
}

export default getChartColorByEngagementRate;
