import type { AnalysisTypeResponse } from "@/hooks/useAnalysis";

/** Values sent to POST /api/analysis/perform as `type` */
export type AnalysisPerformType = string;

export interface AnalysisTypeOption {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  /** Payload value for runAnalysis (defaults to name) */
  performType: AnalysisPerformType;
}

const SUPPLEMENTAL_TYPES: Omit<AnalysisTypeOption, "id">[] = [
  {
    name: "Debit Interest",
    performType: "DEBIT_INTEREST",
    description: "Debit / overdraft interest analysis",
    isActive: true,
  },
  {
    name: "Credit Interest",
    performType: "CREDIT_INTEREST",
    description: "Credit interest analysis",
    isActive: true,
  },
  {
    name: "Fees",
    performType: "FEES",
    description: "Fees analysis",
    isActive: true,
  },
  {
    name: "Cash Collateral",
    performType: "COLLATERAL",
    description: "Cash collateral analysis",
    isActive: true,
  },
];

function normalizeKey(name: string): string {
  return name.trim().toUpperCase().replace(/[\s-]+/g, "_");
}

/** COT / CMF duplicate CAMF in product terminology */
function isRedundantCamfDuplicate(name: string, hasCamf: boolean): boolean {
  if (!hasCamf) return false;
  const key = normalizeKey(name);
  return key === "COT" || key === "CMF" || key === "COT_CHARGE";
}

function hasCamfType(types: { name: string }[]): boolean {
  return types.some((t) => {
    const key = normalizeKey(t.name);
    return key === "CAMF" || key === "CMF";
  });
}

function toOption(type: AnalysisTypeResponse): AnalysisTypeOption {
  const key = normalizeKey(type.name);
  let performType = type.name;
  if (key === "CAMF" || key === "CMF") performType = "CAMF";
  if (key === "COT") performType = "CAMF";
  return {
    id: type.id,
    name: key === "COT" ? "CAMF" : type.name,
    description: type.description,
    isActive: type.isActive,
    performType,
  };
}

/**
 * Merge API analysis types with required UI options, dedupe COT vs CAMF.
 */
export function normalizeAnalysisTypesForUi(
  apiTypes: AnalysisTypeResponse[],
): AnalysisTypeOption[] {
  const activeApi = apiTypes.filter((t) => t.isActive !== false);
  const camfPresent = hasCamfType(activeApi);

  const fromApi = activeApi
    .filter((t) => !isRedundantCamfDuplicate(t.name, camfPresent))
    .map(toOption);

  const existingKeys = new Set(fromApi.map((t) => normalizeKey(t.performType)));

  const merged = [...fromApi];
  for (const sup of SUPPLEMENTAL_TYPES) {
    if (existingKeys.has(normalizeKey(sup.performType))) continue;
    if (existingKeys.has(normalizeKey(sup.name))) continue;
    merged.push({
      ...sup,
      id: `local-${normalizeKey(sup.performType).toLowerCase()}`,
    });
    existingKeys.add(normalizeKey(sup.performType));
  }

  return merged.sort((a, b) => a.name.localeCompare(b.name));
}

export function resolvePerformType(
  options: AnalysisTypeOption[],
  selectedName: string | null,
): AnalysisPerformType | null {
  if (!selectedName) return null;
  const match = options.find(
    (t) => t.name === selectedName || normalizeKey(t.name) === normalizeKey(selectedName),
  );
  return match?.performType ?? selectedName;
}
