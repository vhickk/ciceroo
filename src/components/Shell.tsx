import type { ReactNode } from 'react';
import { Phone } from 'lucide-react';

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 text-lg font-black text-white shadow-lg shadow-teal-500/30 md:h-11 md:w-11">
        C
      </div>
      {!compact && (
        <div className="leading-tight">
          <div className="text-lg font-black tracking-tight text-slate-900">Ciceroo</div>
          <div className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
            by Skujy Tutorials
          </div>
        </div>
      )}
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-dvh overflow-x-hidden">
      {/* Ambient full-screen background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#ffffff,transparent_60%)]" />
        <div className="animate-float-slow absolute -top-32 -right-24 h-[420px] w-[420px] rounded-full bg-teal-400/15 blur-[120px]" />
        <div className="absolute top-1/3 -left-40 h-[520px] w-[520px] rounded-full bg-cyan-400/10 blur-[130px]" />
        <div className="absolute -bottom-40 right-1/4 h-[440px] w-[440px] rounded-full bg-emerald-300/10 blur-[120px]" />
      </div>

      {/* Sticky header */}
      <header className="sticky top-0 z-40 border-b border-slate-100/80 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-8">
          <Brand />
          <div className="flex items-center gap-2">
            <span className="hidden rounded-full bg-teal-50 px-3 py-1.5 text-[11px] font-black text-teal-700 sm:inline-block">
              Skujy Tutorials
            </span>
            <span className="rounded-full border border-slate-200 px-3 py-1.5 text-[11px] font-bold text-slate-500">
              UNILAG 2025/2026
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 pb-24 pt-6 md:px-8 md:pt-10">{children}</main>

      <footer className="border-t border-slate-100 bg-white/60">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-center md:flex-row md:px-8 md:text-left">
          <div className="flex items-center gap-3">
            <Brand compact />
            <div className="text-xs font-semibold text-slate-500">
              UNILAG 2025/2026 Admission Intelligence
            </div>
          </div>
          <a
            href="tel:09069882502"
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-xs font-bold text-white transition hover:bg-slate-800"
          >
            <Phone className="h-3.5 w-3.5" /> 09069882502
          </a>
        </div>
      </footer>
    </div>
  );
}
