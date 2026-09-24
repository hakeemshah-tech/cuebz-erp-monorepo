/**
 * Serialize rows to CSV and trigger a client-side download.
 *
 * Values are quoted and embedded quotes doubled, so commas, quotes and
 * newlines inside a cell cannot break the column alignment.
 */
function escapeCell(value: unknown): string {
  if (value === null || value === undefined) return '""';
  const asText = typeof value === "object" ? JSON.stringify(value) : String(value);
  return `"${asText.replace(/"/g, '""')}"`;
}

export function exportToCSV(
  rows: unknown[],
  header?: string,
  filename: string = "export"
): void {
  if (typeof window === "undefined" || !rows?.length) return;

  const lines: string[] = [];
  if (header) lines.push(header);

  for (const row of rows) {
    // Rows arrive either as arrays of cells or as plain record objects.
    const cells = Array.isArray(row)
      ? row
      : Object.values((row ?? {}) as Record<string, unknown>);
    lines.push(cells.map(escapeCell).join(","));
  }

  // The BOM keeps Excel from mis-reading UTF-8 accented characters.
  const blob = new Blob(["﻿" + lines.join("\n")], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default exportToCSV;
