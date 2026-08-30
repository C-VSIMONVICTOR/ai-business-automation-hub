'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

type Lead = { id: string; name: string; email: string; company?: string | null; message?: string | null; status: string; ai_score?: number | null; ai_temperature?: string | null; ai_category?: string | null; ai_recommended_action?: string | null; created_at: string };

export default function LeadTable() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const response = await fetch('/api/leads', { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to load leads.');
      setLeads(Array.isArray(data.leads) ? data.leads : []);
    } catch (e) { setError(e instanceof Error ? e.message : 'Unable to load leads.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const filtered = useMemo(() => leads.filter((lead) => `${lead.name} ${lead.email} ${lead.company ?? ''} ${lead.ai_category ?? ''}`.toLowerCase().includes(query.toLowerCase())), [leads, query]);
  const hot = leads.filter((lead) => lead.ai_temperature === 'Hot').length;
  const average = leads.length ? Math.round(leads.reduce((sum, lead) => sum + (lead.ai_score ?? 0), 0) / leads.length) : 0;

  return <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
    <div className="flex flex-wrap items-center justify-between gap-4"><div><h2 className="text-xl font-semibold">Recent leads</h2><p className="mt-1 text-sm text-slate-400">Live records from the lead API.</p></div><button onClick={() => void load()} disabled={loading} className="rounded-lg border border-slate-700 px-3 py-2 text-sm disabled:opacity-50">{loading ? 'Loading…' : 'Refresh'}</button></div>
    <div className="mt-5 grid gap-3 sm:grid-cols-3"><div className="rounded-xl bg-slate-950 p-4"><p className="text-xs text-slate-500">Total</p><p className="text-2xl font-bold">{leads.length}</p></div><div className="rounded-xl bg-slate-950 p-4"><p className="text-xs text-slate-500">Hot</p><p className="text-2xl font-bold">{hot}</p></div><div className="rounded-xl bg-slate-950 p-4"><p className="text-xs text-slate-500">Average score</p><p className="text-2xl font-bold">{average}</p></div></div>
    <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search leads…" className="mt-5 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400" />
    {loading ? <div className="mt-6 p-8 text-center text-sm text-slate-400">Loading live leads…</div> : error ? <div className="mt-6 rounded-xl border border-red-900 bg-red-950/30 p-5 text-sm text-red-300">{error}</div> : filtered.length === 0 ? <div className="mt-6 rounded-xl border border-dashed border-slate-700 p-8 text-center text-sm text-slate-400">No leads found. Submit one using the form.</div> : <div className="mt-6 space-y-3">{filtered.map((lead) => <article key={lead.id} className="rounded-xl border border-slate-800 bg-slate-950 p-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="font-semibold">{lead.name}</p><p className="text-sm text-slate-500">{lead.email}{lead.company ? ` · ${lead.company}` : ''}</p></div><span className="rounded-full border border-slate-700 px-3 py-1 text-xs">{lead.ai_temperature ?? 'Unclassified'} · {lead.ai_score ?? 0}/100</span></div><p className="mt-3 text-sm text-cyan-300">{lead.ai_category ?? 'Uncategorized'}</p><p className="mt-1 text-sm text-slate-400">{lead.ai_recommended_action ?? 'Review this lead.'}</p></article>)}</div>}
  </section>;
}
