import React from "react";

/** Colour an engagement rate against the 40%/20% benchmark bands. */
export function getEngagementRate(value: number | string) {
  const rate = Number(value) || 0;
  const tone =
    rate >= 40 ? "text-green-600" : rate >= 20 ? "text-amber-600" : "text-red-600";

  return <span className={`font-medium ${tone}`}>{rate.toFixed(1)}%</span>;
}

export default getEngagementRate;
