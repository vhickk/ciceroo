import { Check, X, BookOpenCheck, ClipboardCheck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Programme } from '../data/programmes';
import type { Analysis, OlevelEntry, StudentInput } from '../lib/scoring';
import { Card } from './ui';

// ── Stylish pass/fail badge ───────────────────────────────────────────────
function Mark({ ok }: { ok: boolean }) {
  return (
    <span
      className={`grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gradient-to-br text-white shadow-sm ${
        ok
          ? 'from-emerald-400 to-teal-500 shadow-emerald-500/40'
          : 'from-rose-400 to-red-500 shadow-rose-500/40'
      }`}
    >
      {ok ? (
        <Check className="h-3.5 w-3.5" strokeWidth={3.5} />
      ) : (
        <X className="h-3.5 w-3.5" strokeWidth={3.5} />
      )}
    </span>
  );
}

interface Row {
  label: string;
  sub?: string;
  ok: boolean;
}

function ColHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-3 text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
      {children}
    </div>
  );
}

function CompareCard({
  icon: Icon,
  title,
  ok,
  checked = true,
  okLabel,
  failLabel,
  left,
  right,
}: {
  icon: LucideIcon;
  title: string;
  ok: boolean;
  checked?: boolean;
  okLabel: string;
  failLabel: string;
  left: Row[];
  right: Row[];
}) {
  const neutral = !checked;
  return (
    <Card className={`overflow-hidden p-6 ${!neutral && !ok ? 'ring-1 ring-rose-100' : ''}`}>
      {/* header */}
      <div className="mb-5 flex items-center gap-2.5">
        <span
          className={`grid h-9 w-9 place-items-center rounded-xl ${
            neutral
              ? 'bg-slate-100 text-slate-400'
              : ok
                ? 'bg-emerald-50 text-emerald-600'
                : 'bg-rose-50 text-rose-500'
          }`}
        >
          <Icon className="h-5 w-5" />
        </span>
        <div className="flex-1">
          <div className="text-sm font-black text-slate-900">{title}</div>
          <div
            className={`text-[11px] font-black uppercase tracking-wide ${
              neutral ? 'text-slate-400' : ok ? 'text-emerald-600' : 'text-rose-500'
            }`}
          >
            {neutral ? 'Add your subjects' : ok ? okLabel : failLabel}
          </div>
        </div>
      </div>

      {/* comparison columns */}
      <div className="grid grid-cols-2 gap-2">
        <div className="pr-3">
          <ColHeader>Your combination</ColHeader>
          <div className="space-y-1.5">
            {left.length === 0 && (
              <div className="text-xs font-semibold text-slate-300">Nothing entered yet</div>
            )}
            {left.map((r, i) => (
              <div key={i} className="flex items-center gap-2">
                <Mark ok={r.ok} />
                <span className="min-w-0 flex-1 truncate text-[13px] font-bold text-slate-700">
                  {r.label}
                </span>
                {r.sub && (
                  <span className="shrink-0 rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-black text-slate-500">
                    {r.sub}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="border-l border-slate-100 pl-3">
          <ColHeader>UNILAG requires</ColHeader>
          <div className="space-y-1.5">
            {right.map((r, i) => (
              <div key={i} className="flex items-center gap-2">
                <Mark ok={r.ok} />
                <span className="min-w-0 flex-1 text-[13px] font-bold text-slate-700">
                  {r.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

// ── Public component: UTME + O/Level comparison, side by side ──────────────
export function CombinationCheck({
  prog,
  input,
  studentResults,
  analysis: a,
}: {
  prog: Programme;
  input: StudentInput;
  studentResults: OlevelEntry[];
  analysis: Analysis;
}) {
  const filledUtme = input.utmeSubjects.filter(Boolean);
  const utmeReqs = prog.utmeReqs && prog.utmeReqs.length ? prog.utmeReqs : null;

  // UTME ── student's chosen subjects (left); ✓ if the subject counts toward a requirement
  const anyGroup = utmeReqs ? utmeReqs.some((g) => g.subjects.includes('__ANY__')) : false;
  const reqSubjects = new Set(
    utmeReqs
      ? utmeReqs.flatMap((g) => g.subjects).filter((s) => s !== '__ANY__')
      : prog.utme.filter((r) => !/\bany\b/i.test(r)),
  );
  const utmeLeft: Row[] = filledUtme.map((s) => ({
    label: s,
    ok: utmeReqs
      ? anyGroup || reqSubjects.has(s)
      : [...reqSubjects].some(
          (r) =>
            s.toLowerCase().includes(r.toLowerCase()) ||
            r.toLowerCase().includes(s.toLowerCase()),
        ),
  }));

  // UTME ── requirement groups (right): show the ACTUAL subjects the student
  // uses to satisfy each group — never a vague "any". When a group isn't met,
  // show the concrete options / how many more are needed.
  let utmeRight: Row[];
  if (utmeReqs) {
    const usedU = new Set<number>();
    utmeRight = utmeReqs.map((g) => {
      const isAny = g.subjects.includes('__ANY__');
      const picked: string[] = [];
      for (let i = 0; i < filledUtme.length && picked.length < g.count; i++) {
        if (usedU.has(i)) continue;
        if (isAny || g.subjects.includes(filledUtme[i])) {
          usedU.add(i);
          picked.push(filledUtme[i]);
        }
      }
      const ok = picked.length >= g.count;
      const need = g.count - picked.length;
      const label = ok
        ? picked.join(' + ')
        : isAny
          ? `${need} more subject${need > 1 ? 's' : ''}`
          : `${g.subjects.join(' / ')}${g.count > 1 ? ` (need ${g.count})` : ''}`;
      return { label, ok };
    });
  } else {
    utmeRight = prog.utme.map((r) => {
      const flexible = /\bany\b/i.test(r);
      const have =
        flexible ||
        filledUtme.some(
          (s) =>
            s.toLowerCase().includes(r.toLowerCase()) ||
            r.toLowerCase().includes(s.toLowerCase()),
        );
      return { label: r.replace(/\bany\s+\d*\s*/i, ''), ok: have };
    });
  }

  // O/Level ── student's subjects + grades (left); check = passing grade
  const olevelLeft: Row[] = studentResults.map((r) => ({
    label: r.subject,
    sub: r.grade,
    ok: r.points > 0,
  }));

  // O/Level ── requirement groups (right): the ACTUAL subjects used to satisfy
  // each group (greedy, best grade first), never "any".
  const passing = studentResults.filter((r) => r.points > 0);
  const usedO = new Set<number>();
  const olevelRight: Row[] = prog.requirements.map((g) => {
    const isAny = g.subjects.includes('__ANY__');
    const picked = passing
      .map((r, i) => ({ r, i }))
      .filter((x) => !usedO.has(x.i) && (isAny || g.subjects.includes(x.r.subject)))
      .sort((p, q) => q.r.points - p.r.points)
      .slice(0, g.count);
    picked.forEach((p) => usedO.add(p.i));
    const ok = picked.length >= g.count;
    const need = g.count - picked.length;
    const label = ok
      ? picked.map((p) => p.r.subject).join(' + ')
      : isAny
        ? `${need} more subject${need > 1 ? 's' : ''}`
        : `${g.subjects.join(' / ')}${g.count > 1 ? ` (need ${g.count})` : ''}`;
    return { label, ok };
  });

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <CompareCard
        icon={BookOpenCheck}
        title="UTME subjects"
        ok={a.utmeOk}
        okLabel="Correct combination"
        failLabel="Needs fixing"
        left={utmeLeft}
        right={utmeRight}
      />
      <CompareCard
        icon={ClipboardCheck}
        title="O/Level requirements"
        ok={a.olevelOk}
        checked={a.olevelChecked}
        okLabel="Satisfied"
        failLabel="Not satisfied"
        left={olevelLeft}
        right={olevelRight}
      />
    </div>
  );
}
