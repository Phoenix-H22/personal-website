export type EvidenceDisplayMode = "numeric" | "textual" | "mixed";

const NUMERIC_EVIDENCE_VALUES = new Set([
  "EGP 21M+",
  "100K+",
  "90K+",
  "397",
  "143",
  "5,000+",
  "2",
  "7",
]);

const TEXTUAL_EVIDENCE_VALUES = new Set([
  "Production",
  "Hajj season",
  "iOS + Android",
  "Completed",
  "PDF + Word",
  "Multi-gateway",
]);

export function getEvidenceDisplayMode(value: string): EvidenceDisplayMode {
  if (NUMERIC_EVIDENCE_VALUES.has(value)) return "numeric";
  if (TEXTUAL_EVIDENCE_VALUES.has(value)) return "textual";
  return "mixed";
}
