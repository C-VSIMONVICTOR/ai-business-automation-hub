# Lead API Contract

## POST /api/leads

Accepts a lead and creates a persistent lead record. AI qualification is performed server-side after validation.

### Request

```json
{
  "name": "Ada Example",
  "email": "ada@example.com",
  "company": "Example Ltd",
  "message": "We need an automated lead qualification workflow."
}
```

### Validation

- `name`: required, 1–200 characters
- `email`: required, valid email format
- `company`: optional
- `message`: required, 1–10,000 characters

### Security

The public application must never expose database service-role credentials or AI API keys. Secrets belong in server-side environment variables.

### Planned response

```json
{
  "success": true,
  "lead": {
    "id": "uuid",
    "name": "Ada Example",
    "email": "ada@example.com",
    "status": "new",
    "ai_temperature": "Warm",
    "ai_score": 78
  }
}
```

The API implementation will be added next, followed by integration tests and the dashboard.
