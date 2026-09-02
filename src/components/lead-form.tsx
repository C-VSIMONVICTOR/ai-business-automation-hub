'use client';

import { FormEvent, useState } from 'react';

export default function LeadForm() {
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<string>('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setBusy(true);
    setResult('');
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.errors?.join(' ') || data.error || 'Unable to create lead.');
      form.reset();
      setResult(`Lead qualified: ${data.lead.ai_temperature} (${data.lead.ai_score}/100)`);
    } catch (error) {
      setResult(error instanceof Error ? error.message : 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
      <h2 className="text-xl font-semibold">Capture a lead</h2>
      <div className="mt-5 space-y-4">
        <input name="name" required maxLength={200} placeholder="Full name" className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400" />
        <input name="email" required type="email" maxLength={320} placeholder="Email address" className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400" />
        <input name="company" maxLength={200} placeholder="Company (optional)" className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400" />
        <textarea name="message" required maxLength={10000} rows={6} placeholder="What does the prospect need?" className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400" />
        <input name="source" defaultValue="dashboard" maxLength={100} className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400" />
        <button disabled={busy} className="w-full rounded-lg bg-cyan-400 px-4 py-3 font-semibold text-slate-950 disabled:opacity-50">{busy ? 'Qualifying…' : 'Qualify lead'}</button>
        {result && <p role="status" className="text-sm text-slate-300">{result}</p>}
      </div>
    </form>
  );
}
