export function createError(message: string, status = 500, details?: unknown) {
  return { message, status, details, isCustom: true };
}
