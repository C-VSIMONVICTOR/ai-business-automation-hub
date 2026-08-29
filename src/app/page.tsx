import LeadForm from '@/components/lead-form';
import LeadTable from '@/components/lead-table';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <header className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">AI Business Automation Hub</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight">Lead qualification workspace</h1>
          <p className="mt-3 max-w-2xl text-slate-400">Capture leads, qualify them automatically, and prepare the next sales action from one production-ready workspace.</p>
        </header>

        <section className="grid gap-6 lg:grid-cols-[380px_1fr]">
          <LeadForm />
          <LeadTable />
        </section>
      </div>
    </main>
  );
}
