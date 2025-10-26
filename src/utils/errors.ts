// src/utils/errors.ts
type ErrorOptions = {
  message: string;
  status?: number;
  code?: string;
  details?: unknown;
  meta?: Record<string, any>;
};

export function createError({
  message,
  status = 500,
  code,
  details,
  meta,
}: ErrorOptions) {
  return { message, status, code, details, meta, isCustom: true };
}
