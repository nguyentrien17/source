import { isAxiosError } from 'axios';

export type FieldErrors = Record<string, string[]>;

function coerceFieldErrors(maybe: unknown): FieldErrors {
  if (!maybe || typeof maybe !== 'object' || Array.isArray(maybe)) return {};
  const out: FieldErrors = {};
  for (const [key, value] of Object.entries(maybe as Record<string, unknown>)) {
    if (Array.isArray(value)) {
      out[key] = value.map(String);
    } else if (typeof value === 'string') {
      out[key] = [value];
    }
  }
  return out;
}

function parseLegacyJoiErrorsList(errors: string[]): FieldErrors {
  const out: FieldErrors = {};
  for (const msg of errors) {
    // Legacy format thường là: "username" is required
    const match = msg.match(/"([^"]+)"/);
    const field = match?.[1] || '_error';
    const cleaned = msg.replace(/"/g, '');
    if (!out[field]) out[field] = [];
    out[field].push(cleaned);
  }
  return out;
}

export function extractServerValidation(error: unknown): {
  fieldErrors: FieldErrors;
  message?: string;
  status?: number;
} | null {
  if (!isAxiosError(error)) return null;

  const status = error.response?.status;
  const data = error.response?.data as any;
  if (!data || typeof data !== 'object') return null;

  // New format từ validate.middleware.js
  if (data.code === 'VALIDATION_ERROR') {
    const fieldErrors = coerceFieldErrors(data.errors);
    return {
      fieldErrors,
      message: typeof data.message === 'string' ? data.message : undefined,
      status,
    };
  }

  // Duplicate username (server business rule)
  if (data.code === 'DUPLICATE_USERNAME') {
    const fieldErrors = coerceFieldErrors(data.errors);
    return {
      fieldErrors,
      message: typeof data.message === 'string' ? data.message : undefined,
      status,
    };
  }

  // Legacy array format
  if (Array.isArray(data.errors)) {
    return {
      fieldErrors: parseLegacyJoiErrorsList(data.errors.map(String)),
      message: typeof data.message === 'string' ? data.message : undefined,
      status,
    };
  }

  return null;
}

export function toAntdFieldErrors(fieldErrors: FieldErrors): Array<{ name: string | string[]; errors: string[] }> {
  return Object.entries(fieldErrors)
    .filter(([name]) => name && name !== '_error')
    .map(([name, errors]) => ({
      name: name.includes('.') ? name.split('.') : name,
      errors,
    }));
}

export function getServerErrorMessage(error: unknown, fallback = 'Có lỗi xảy ra!'): string {
  if (isAxiosError(error)) {
    const data = error.response?.data as any;
    const msg = data?.message;
    if (typeof msg === 'string' && msg.trim()) return msg;
  }
  return fallback;
}
