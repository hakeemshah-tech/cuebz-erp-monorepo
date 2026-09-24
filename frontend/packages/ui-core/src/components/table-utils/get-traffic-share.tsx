import React from "react";

/**
 * Render a traffic-share fraction as a labelled proportion bar.
 * Values arrive from the analytics API as a 0-100 percentage.
 */
export function getTrafficShare(value: number | string) {
  const share = Math.min(100, Math.max(0, Number(value) || 0));

  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
        <div
          className="h-full rounded-full bg-primary"
          style={{ width: `${share}%` }}
        />
      </div>
      <span className="text-sm font-medium">{share.toFixed(1)}%</span>
    </div>
  );
}

/**
 * Chart colour for a traffic-share value, banded so the largest sources read
 * as the strongest marks.
 */
export function getChartColorByTrafficShare(value: number | string): string {
  const share = Number(value) || 0;
  if (share >= 50) return "#0070F3";
  if (share >= 25) return "#3694FF";
  if (share >= 10) return "#7CB8FF";
  return "#C7DEFF";
}

export default getTrafficShare;
