# System Architecture

## Request flow

1. A lead is submitted by a form or an external integration.
2. The server validates and normalizes the payload.
3. The AI service analyzes intent, category, urgency, and qualification signals.
4. The application validates the structured AI result.
5. The lead and analysis are persisted in PostgreSQL/Supabase.
6. Automation can notify a team or trigger a downstream CRM workflow.
7. The API returns a stable result to the caller.

## Trust boundaries

- Browser/client input is untrusted.
- AI output is untrusted until schema validation succeeds.
- Secrets remain server-side.
- Database access uses least-privilege credentials.
- External webhooks require authentication/signature validation.

## Initial API contract

`POST /api/leads`

Request:

```json
{
  "name": "Ada Example",
  "email": "ada@example.com",
  "company": "Example Ltd",
  "message": "We need to automate inbound sales leads."
}
```

Response will contain a lead identifier, qualification score, classification, summary, and recommended action after the implementation is connected to the database and AI provider.
