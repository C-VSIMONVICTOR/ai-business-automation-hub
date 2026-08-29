export const LEAD_API = {
  method: 'POST',
  path: '/api/leads',
  request: {
    name: 'string, required, 1–200 chars',
    email: 'string, required, valid email',
    company: 'string, optional, max 200 chars',
    message: 'string, required, 1–10,000 chars',
    source: 'string, optional, defaults to api',
  },
  success: {
    status: 201,
    body: {
      success: true,
      lead: 'persisted lead object',
    },
  },
  validationError: {
    status: 400,
    body: {
      success: false,
      errors: ['validation messages'],
    },
  },
} as const;
