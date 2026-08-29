export type LeadInput = {
  name: string;
  email: string;
  company?: string;
  message: string;
  source?: string;
};

export type ValidationResult =
  | { ok: true; data: Required<Pick<LeadInput, 'name' | 'email' | 'message'>> & Pick<LeadInput, 'company' | 'source'> }
  | { ok: false; errors: string[] };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLead(input: unknown): ValidationResult {
  if (!input || typeof input !== 'object') {
    return { ok: false, errors: ['Request body must be an object.'] };
  }

  const body = input as Record<string, unknown>;
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const company = typeof body.company === 'string' ? body.company.trim() : undefined;
  const message = typeof body.message === 'string' ? body.message.trim() : '';
  const source = typeof body.source === 'string' && body.source.trim() ? body.source.trim() : 'api';

  const errors: string[] = [];
  if (!name || name.length > 200) errors.push('name is required and must be 1–200 characters.');
  if (!EMAIL_RE.test(email) || email.length > 320) errors.push('email must be a valid email address.');
  if (!message || message.length > 10000) errors.push('message is required and must be 1–10,000 characters.');
  if (company && company.length > 200) errors.push('company must be at most 200 characters.');

  if (errors.length) return { ok: false, errors };
  return { ok: true, data: { name, email, company, message, source } };
}
