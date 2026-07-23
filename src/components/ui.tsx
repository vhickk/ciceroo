import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import type { LucideIcon } from 'lucide-react';

export function Card({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[1.75rem] border border-slate-100 bg-white shadow-[0_20px_60px_-25px_rgba(15,23,42,0.15)] ${className}`}
    >
      {children}
    </div>
  );
}

export function SectionLabel({
  icon: Icon,
  children,
}: {
  icon?: LucideIcon;
  children: ReactNode;
}) {
  return (
    <div className="mb-3 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.16em] text-teal-600">
      {Icon && <Icon className="h-4 w-4" />}
      {children}
    </div>
  );
}

export function StatTile({
  icon: Icon,
  label,
  value,
  sub,
  tone = 'slate',
  delay = 0,
}: {
  icon: LucideIcon;
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  tone?: 'teal' | 'emerald' | 'amber' | 'rose' | 'slate' | 'cyan' | 'violet';
  delay?: number;
}) {
  const tones: Record<string, string> = {
    teal: 'bg-teal-50 text-teal-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    rose: 'bg-rose-50 text-rose-600',
    slate: 'bg-slate-100 text-slate-500',
    cyan: 'bg-cyan-50 text-cyan-600',
    violet: 'bg-violet-50 text-violet-600',
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="flex flex-col rounded-[1.5rem] border border-slate-100 bg-white p-5 shadow-[0_16px_40px_-28px_rgba(15,23,42,0.25)]"
    >
      <div className={`mb-4 grid h-11 w-11 place-items-center rounded-2xl ${tones[tone]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
        {label}
      </div>
      <div className="mt-1 text-2xl font-black leading-none tracking-tight text-slate-900 tabular-nums md:text-3xl">
        {value}
      </div>
      {sub && <div className="mt-2 text-xs font-semibold text-slate-500">{sub}</div>}
    </motion.div>
  );
}

export function Chip({
  children,
  tone = 'slate',
}: {
  children: ReactNode;
  tone?: 'have' | 'need' | 'info' | 'slate';
}) {
  const tones: Record<string, string> = {
    have: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    need: 'bg-rose-50 text-rose-700 ring-rose-100',
    info: 'bg-slate-50 text-slate-600 ring-slate-200',
    slate: 'bg-slate-50 text-slate-600 ring-slate-200',
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold ring-1 ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function PrimaryButton({
  children,
  onClick,
  disabled,
  type = 'button',
  className = '',
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit';
  className?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 px-6 py-3.5 text-sm font-black text-white shadow-lg shadow-teal-500/30 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none ${className}`}
    >
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  onClick,
  className = '',
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-bold text-slate-600 transition hover:border-slate-300 hover:text-slate-900 ${className}`}
    >
      {children}
    </button>
  );
}
