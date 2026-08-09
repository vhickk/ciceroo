import { Check } from 'lucide-react';

const LABELS = ['Name', 'Course', 'UTME', 'O/Level', 'Post-UTME', 'Results'];

export function Stepper({ step }: { step: number }) {
  return (
    <div className="mx-auto mb-6 flex max-w-2xl items-center justify-between md:mb-8">
      {LABELS.map((label, i) => {
        const done = i < step;
        const active = i === step;
        return (
          <div key={label} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`grid h-8 w-8 place-items-center rounded-full text-xs font-black transition ${
                  done
                    ? 'bg-teal-500 text-white shadow-md shadow-teal-500/30'
                    : active
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-400'
                }`}
              >
                {done ? <Check className="h-4 w-4" strokeWidth={3} /> : i + 1}
              </div>
              <span
                className={`text-[9px] font-black uppercase tracking-[0.12em] ${
                  active ? 'text-slate-900' : 'text-slate-400'
                }`}
              >
                {label}
              </span>
            </div>
            {i < LABELS.length - 1 && (
              <div
                className={`mx-1.5 h-0.5 flex-1 rounded-full md:mx-3 ${
                  done ? 'bg-teal-500' : 'bg-slate-100'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
