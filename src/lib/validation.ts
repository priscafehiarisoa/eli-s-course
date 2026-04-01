const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
const POSTAL_CODE_REGEX = /^[A-Za-z0-9\-\s]{3,12}$/;

export function normalizeText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function isValidEmail(value: string): boolean {
  return EMAIL_REGEX.test(value);
}

export function isValidPostalCode(value: string): boolean {
  return POSTAL_CODE_REGEX.test(value);
}

export function isReasonableLength(value: string, min: number, max: number): boolean {
  return value.length >= min && value.length <= max;
}
