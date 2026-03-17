export const parseNumber = (
  value: string,
  allowDecimal: boolean = false,
): number | null => {
  const integerRegex = /^[1-9]\d*$/;
  const decimalRegex = /^(0|[1-9]\d*)([.,]\d+)?$/;

  if (typeof value !== "string") return null;

  const trimmed = value.trim();

  if (!allowDecimal) {
    if (!integerRegex.test(trimmed)) return null;
    return parseInt(trimmed, 10);
  }

  if (!decimalRegex.test(trimmed)) return null;

  const normalized = trimmed.replace(",", ".");
  const num = parseFloat(normalized);

  if (isNaN(num)) return null;

  return Math.round(num * 10) / 10;
};
