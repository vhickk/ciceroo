import { Check, X, BookOpenCheck, ClipboardCheck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Programme, ReqGroup } from '../data/programmes';
import type { Analysis, OlevelEntry, StudentInput } from '../lib/scoring';
import { Card } from './ui';

// How UNILAG's requirement for one group reads — the requirement itself, never
// the student's own pick (a flexible slot is "N electives" / a choice from a
// pool, not whatever subject the student happened to use for it).
function requirementLabel(g: ReqGroup): string {
  if (g.subjects.includes('__ANY__'))
    return g.label
      ? `${g.count} of: ${g.label}`
      : `${g.count} free elective${g.count > 1 ? 's' : ''} (any subject)`;
  // a fixed, fully-required set (e.g. a single named subject)
  if (g.count >= g.subjects.length) return g.subjects.join(' + ');
  // choose N from a larger pool — show the real options UNILAG accepts
  return `${g.count} of: ${g.subjects.join(' / ')}`;
}

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

// One requirement, and the subject(s) the student actually used for it.
interface ReqRow {
  requirement: string; // what UNILAG asks for this slot
  used: string; // the subject(s) the student used to satisfy it (with grades for O/Level)
  ok: boolean;
}

function CompareCard({
  icon: Icon,
  title,
  ok,
  checked = true,
  okLabel,
  failLabel,
  rows,
}: {
  icon: LucideIcon;
  title: string;
  ok: boolean;
  checked?: boolean;
  okLabel: string;
  failLabel: string;
  rows: ReqRow[];
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

      {/* column labels (offset past the mark) */}
      <div className="mb-2 flex items-center gap-2.5">
        <span className="h-6 w-6 shrink-0" />
        <div className="grid flex-1 grid-cols-2 gap-3 text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
          <div>UNILAG requires</div>
          <div>You used</div>
        </div>
      </div>

      {/* one row per requirement: requirement ↔ the subject(s) used for it */}
      <div className="space-y-2.5">
        {rows.map((r, i) => (
          <div key={i} className="flex items-start gap-2.5">
            <Mark ok={r.ok} />
            <div className="grid flex-1 grid-cols-2 gap-3">
              <span className="text-[13px] font-bold leading-snug text-slate-600">
                {r.requirement}
              </span>
              <span
                className={`text-[13px] font-bold leading-snug ${
                  r.ok ? 'text-slate-900' : 'text-rose-500'
                }`}
              >
                {r.used || '— not met —'}
              </span>
            </div>
          </div>
        ))}
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

  // UTME ── one row per requirement: what UNILAG asks + the subject the student
  // actually used for it (allocated in order so each subject counts once).
  let utmeRows: ReqRow[];
  if (utmeReqs) {
    const usedU = new Set<number>();
    utmeRows = utmeReqs.map((g) => {
      const isAny = g.subjects.includes('__ANY__');
      const picked: string[] = [];
      for (let i = 0; i < filledUtme.length && picked.length < g.count; i++) {
        if (usedU.has(i)) continue;
        if (isAny || g.subjects.includes(filledUtme[i])) {
          usedU.add(i);
          picked.push(filledUtme[i]);
        }
      }
      return {
        requirement: requirementLabel(g),
        used: picked.join(', '),
        ok: picked.length >= g.count,
      };
    });
  } else {
    utmeRows = prog.utme.map((r) => {
      const flexible = /\bany\b/i.test(r);
      const match = filledUtme.find(
        (s) =>
          s.toLowerCase().includes(r.toLowerCase()) ||
          r.toLowerCase().includes(s.toLowerCase()),
      );
      return { requirement: r, used: match || '', ok: flexible || !!match };
    });
  }

  // O/Level ── one row per requirement: what UNILAG asks + the actual subject(s)
  // (with grades) the student used, best grade first. Only the subjects that
  // count are shown — not the whole result sheet.
  const passing = studentResults.filter((r) => r.points > 0);
  const usedO = new Set<number>();
  const olevelRows: ReqRow[] = prog.requirements.map((g) => {
    const isAny = g.subjects.includes('__ANY__');
    const picked = passing
      .map((r, i) => ({ r, i }))
      .filter((x) => !usedO.has(x.i) && (isAny || g.subjects.includes(x.r.subject)))
      .sort((p, q) => q.r.points - p.r.points)
      .slice(0, g.count);
    picked.forEach((p) => usedO.add(p.i));
    return {
      requirement: requirementLabel(g),
      used: picked.map((p) => `${p.r.subject} (${p.r.grade})`).join(', '),
      ok: picked.length >= g.count,
    };
  });

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <CompareCard
        icon={BookOpenCheck}
        title="UTME subjects"
        ok={a.utmeOk}
        okLabel="Correct combination"
        failLabel="Needs fixing"
        rows={utmeRows}
      />
      <CompareCard
        icon={ClipboardCheck}
        title="O/Level requirements"
        ok={a.olevelOk}
        checked={a.olevelChecked}
        okLabel="Satisfied"
        failLabel="Not satisfied"
        rows={olevelRows}
      />
    </div>
  );
}
