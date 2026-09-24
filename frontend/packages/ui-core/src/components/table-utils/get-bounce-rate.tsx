import React from "react";

/**
 * Colour a bounce rate. The scale is inverted relative to engagement:
 * a lower bounce rate is the better outcome.
 */
export function getBounceRate(value: number | string) {
  const rate = Number(value) || 0;
  const tone =
    rate <= 40 ? "text-green-600" : rate <= 70 ? "text-amber-600" : "text-red-600";

  return <span className={`font-medium ${tone}`}>{rate.toFixed(1)}%</span>;
}

export default getBounceRate;
