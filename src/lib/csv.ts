/**
 * Client-side CSV export. No server round-trip: the file is assembled in memory and handed to
 * the browser as a blob.
 *
 * Two details that matter for a public registry export:
 *
 * 1. Every cell is quoted and internal quotes are doubled, per RFC 4180. Meeting types and
 *    statuses are free text from a CMS, and a comma in one of them would otherwise shift every
 *    subsequent column in that row.
 * 2. A UTF-8 byte order mark is prepended. Without it, Excel on Windows opens the file as
 *    Latin-1 and mangles every accented character — which on a bilingual municipal site means
 *    every French string in the export. The BOM is the difference between "Comité" and "ComitÃ©"
 *    for the resident who downloads this.
 */
export const toCsv = (header: readonly string[], rows: readonly (readonly string[])[]): string => {
  const escapeCell = (cell: string) => `"${String(cell).replace(/"/g, '""')}"`;
  return [header, ...rows].map((row) => row.map(escapeCell).join(',')).join('\r\n');
};

/** Trigger a browser download of `content` as `filename`. Revokes the object URL after use. */
export const downloadCsv = (filename: string, content: string): void => {
  const blob = new Blob(['﻿', content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
