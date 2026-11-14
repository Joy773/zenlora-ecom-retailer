export function formatPrice(value?: string) {
  const trimmed = value?.trim() ?? "";
  if (!trimmed) return "";
  if (/^(৳|tk\.?|bdt\s)/i.test(trimmed)) return trimmed;
  return `৳${trimmed}`;
}
