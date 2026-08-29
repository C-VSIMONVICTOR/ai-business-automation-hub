'use client';

import { useState } from 'react';

export default function LeadTable() {
  const [message] = useState('Connect the dashboard list to authenticated Supabase reads in the next build step.');

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Recent leads</h2>
          <p className="mt-1 text-sm text-slate-400">Qualification results and recommended actions.</p>
        </div>
        <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-400">Live data next</span>
      </div>
      <div className="mt-6 rounded-xl border border-dashed border-slate-700 p-8 text-center text-sm text-slate-400">{message}</div>
    </section>
  );
}
