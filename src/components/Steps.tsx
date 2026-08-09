import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  ArrowLeft,
  Search,
  User,
  GraduationCap,
  Hash,
  BookOpenCheck,
  Plus,
  X,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import { PROGRAMMES, GRADES, SUBJECTS, ALL_STATES } from '../data/programmes';
import { facultyMeta, facultyShort } from '../lib/ui';
import { Card, PrimaryButton, GhostButton } from './ui';
import { OcrUpload } from './OcrUpload';
import { parseUTMEResult, parseOLevelResult } from '../lib/ocr';

export interface OlevelRow {
  subject: string;
  grade: string;
}

function StepFrame({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-2xl"
    >
      <div className="mb-6 text-center">
        <div className="mb-2 text-[11px] font-black uppercase tracking-[0.2em] text-teal-600">
          {eyebrow}
        </div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 md:text-4xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mx-auto mt-2 max-w-md text-sm font-medium text-slate-500">{subtitle}</p>
        )}
      </div>
      {children}
    </motion.div>
  );
}

// ── Step 1: Name (hero landing) ───────────────────────────────────────────
export function StepName({
  value,
  onChange,
  onNext,
}: {
  value: string;
  onChange: (v: string) => void;
  onNext: () => void;
}) {
  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };
  return (
    <div className="relative mx-auto max-w-3xl">
      {/* vivid ambient colour blobs — the "pop" */}
      <div className="pointer-events-none absolute inset-x-0 -top-28 -z-0 h-[520px] overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[360px] w-[720px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(45,212,191,0.28),transparent_65%)]" />
        <div className="absolute -left-24 top-8 h-72 w-72 rounded-full bg-violet-400/30 blur-[110px]" />
        <div className="absolute -right-24 top-20 h-72 w-72 rounded-full bg-emerald-300/30 blur-[110px]" />
        <div className="absolute left-1/3 top-40 h-64 w-64 rounded-full bg-amber-300/20 blur-[110px]" />
      </div>

      <div className="relative pt-6 text-center sm:pt-10">
        {/* eyebrow pill with a live ping dot */}
        <motion.div {...fadeUp} transition={{ duration: 0.5 }}>
          <span className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50/80 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-teal-700 shadow-sm backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-500" />
            </span>
            UNILAG 2025/2026 · Official data
          </span>
        </motion.div>

        {/* gradient headline */}
        <motion.h1
          {...fadeUp}
          transition={{ duration: 0.55, delay: 0.06 }}
          className="mt-6 text-4xl font-black leading-[1.03] tracking-[-0.035em] sm:text-6xl"
        >
          <span className="bg-gradient-to-br from-slate-900 to-slate-600 bg-clip-text text-transparent">
            Know your UNILAG
          </span>{' '}
          <span className="block bg-gradient-to-r from-teal-500 via-cyan-500 to-violet-500 bg-clip-text text-transparent sm:inline">
            chances, instantly.
          </span>
        </motion.h1>

        <motion.p
          {...fadeUp}
          transition={{ duration: 0.55, delay: 0.12 }}
          className="mx-auto mt-5 max-w-lg text-base font-medium leading-relaxed text-slate-500 sm:text-lg"
        >
          Enter your UTME, O'Level and Post-UTME scores to see your exact UNILAG aggregate — and
          whether you're in, measured against the official 2025/2026 cut-offs.
        </motion.p>

        {/* name input + popping CTA */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.55, delay: 0.18 }}
          className="mx-auto mt-9 max-w-md"
        >
          <Card className="p-5 text-left sm:p-6">
            <label className="mb-2 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
              <User className="h-4 w-4" /> What's your first name?
            </label>
            <input
              autoFocus
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && value.trim() && onNext()}
              placeholder="Enter your first name…"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-5 py-4 text-lg font-semibold text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
            />
            <button
              onClick={onNext}
              disabled={!value.trim()}
              className="group relative mt-4 flex w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-teal-500 via-cyan-500 to-violet-500 px-6 py-4 text-base font-black text-white shadow-[0_18px_40px_-14px_rgba(13,148,136,0.7)] transition duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none disabled:hover:translate-y-0"
            >
              <span className="relative z-10 flex items-center gap-2">
                Check my chances
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 -left-full w-1/2 skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/40 to-transparent transition-all duration-700 ease-out group-hover:left-[150%]"
              />
            </button>
          </Card>
        </motion.div>

        {/* trust checklist */}
        <motion.ul
          {...fadeUp}
          transition={{ duration: 0.55, delay: 0.24 }}
          className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2"
        >
          {['Free to use', 'No sign-up', 'Your exact aggregate', 'Instant verdict'].map((item) => (
            <li key={item} className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
              <CheckCircle2 className="h-3.5 w-3.5 text-teal-500" /> {item}
            </li>
          ))}
        </motion.ul>
      </div>
    </div>
  );
}

// ── Step 2: Programme ─────────────────────────────────────────────────────
export function StepProgramme({
  value,
  onChange,
  onNext,
  onBack,
  name,
}: {
  value: string;
  onChange: (v: string) => void;
  onNext: () => void;
  onBack: () => void;
  name: string;
}) {
  const [q, setQ] = useState('');
  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return PROGRAMMES;
    return PROGRAMMES.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.faculty.toLowerCase().includes(query),
    );
  }, [q]);

  return (
    <StepFrame
      eyebrow={name ? `Alright, ${name}` : 'Course choice'}
      title="Which course are you aiming for?"
      subtitle="Pick your first-choice UNILAG programme. We'll check exactly what it takes."
    >
      <Card className="overflow-hidden">
        <div className="border-b border-slate-100 p-4">
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 focus-within:border-teal-400 focus-within:ring-4 focus-within:ring-teal-500/10">
            <Search className="h-4 w-4 shrink-0 text-slate-400" />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search 90+ programmes…"
              className="w-full bg-transparent text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-300"
            />
          </div>
        </div>
        <div className="no-scrollbar max-h-[46vh] overflow-y-auto p-2">
          {filtered.map((p) => {
            const meta = facultyMeta(p.faculty);
            const Icon = meta.icon;
            const active = value === p.name;
            return (
              <button
                key={p.name}
                onClick={() => onChange(p.name)}
                className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition ${
                  active ? 'bg-teal-50 ring-1 ring-teal-200' : 'hover:bg-slate-50'
                }`}
              >
                <span
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${meta.grad} text-white`}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold text-slate-900">{p.name}</span>
                  <span className="block truncate text-xs font-semibold text-slate-400">
                    {facultyShort(p.faculty)}
                  </span>
                </span>
                {active && (
                  <span className="rounded-full bg-teal-500 px-2 py-0.5 text-[10px] font-black uppercase text-white">
                    Picked
                  </span>
                )}
              </button>
            );
          })}
          {filtered.length === 0 && (
            <div className="p-8 text-center text-sm font-semibold text-slate-400">
              No programme matches “{q}”.
            </div>
          )}
        </div>
      </Card>
      <div className="mt-6 flex items-center justify-between">
        <GhostButton onClick={onBack}>
          <ArrowLeft className="h-4 w-4" /> Back
        </GhostButton>
        <PrimaryButton onClick={onNext} disabled={!value}>
          Continue <ArrowRight className="h-4 w-4" />
        </PrimaryButton>
      </div>
    </StepFrame>
  );
}

// ── Step 3: UTME ──────────────────────────────────────────────────────────
export function StepUTME({
  score,
  onScore,
  subjects,
  onSubjects,
  onNext,
  onBack,
}: {
  score: string;
  onScore: (v: string) => void;
  subjects: string[];
  onSubjects: (v: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [extracted, setExtracted] = useState<{
    score: number | null;
    subjects: string[];
  } | null>(null);

  const setSubject = (i: number, v: string) => {
    const next = [...subjects];
    next[i] = v;
    onSubjects(next);
  };
  const scoreNum = parseFloat(score) || 0;
  const valid = scoreNum > 0 && scoreNum <= 400;

  const handleOcr = (text: string) => {
    const parsed = parseUTMEResult(text);
    if (parsed.score) onScore(String(parsed.score));
    if (parsed.subjects.length) {
      const next = [...subjects];
      parsed.subjects.forEach((s, i) => {
        if (i < 4) next[i] = s;
      });
      onSubjects(next);
    }
    setExtracted(parsed);
  };

  return (
    <StepFrame
      eyebrow="Step 3"
      title="Your UTME (JAMB) details"
      subtitle="Enter your score out of 400 and the four subjects you sat for."
    >
      <Card className="p-6 md:p-8">
        <OcrUpload
          label="Upload your JAMB result slip"
          hint="Click or drag & drop — JPG, PNG or PDF. We'll auto-fill your score & subjects."
          onText={handleOcr}
          renderResult={
            extracted && (extracted.score || extracted.subjects.length) ? (
              <div className="flex flex-wrap gap-1.5 text-xs font-bold text-slate-600">
                {extracted.score && (
                  <span className="rounded-md bg-teal-50 px-2 py-0.5 text-teal-700 ring-1 ring-teal-100">
                    Score {extracted.score}
                  </span>
                )}
                {extracted.subjects.map((s) => (
                  <span
                    key={s}
                    className="rounded-md bg-slate-50 px-2 py-0.5 ring-1 ring-slate-200"
                  >
                    {s}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs font-semibold text-amber-600">
                Couldn't read the details — please fill them in manually below.
              </p>
            )
          }
        />
        <label className="mb-2 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
          <Hash className="h-4 w-4" /> UTME score (out of 400)
        </label>
        <input
          autoFocus
          inputMode="numeric"
          value={score}
          onChange={(e) => onScore(e.target.value.replace(/[^0-9.]/g, ''))}
          placeholder="e.g. 280"
          className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-5 py-4 text-2xl font-black tracking-tight text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
        />
        {score && !valid && (
          <p className="mt-2 text-xs font-bold text-rose-500">Score must be between 1 and 400.</p>
        )}

        <div className="mt-6">
          <div className="mb-3 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
            <BookOpenCheck className="h-4 w-4" /> Your 4 UTME subjects
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {subjects.map((s, i) => (
              <select
                key={i}
                value={s}
                onChange={(e) => setSubject(i, e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
              >
                <option value="">
                  {i === 0 ? 'English Language' : `Subject ${i + 1}`}…
                </option>
                {SUBJECTS.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            ))}
          </div>
        </div>
      </Card>
      <div className="mt-6 flex items-center justify-between">
        <GhostButton onClick={onBack}>
          <ArrowLeft className="h-4 w-4" /> Back
        </GhostButton>
        <PrimaryButton onClick={onNext} disabled={!valid}>
          Continue <ArrowRight className="h-4 w-4" />
        </PrimaryButton>
      </div>
    </StepFrame>
  );
}

// ── Step 4: O/Level ───────────────────────────────────────────────────────
export function StepOLevel({
  rows,
  onRows,
  stateOfOrigin,
  onState,
  onNext,
  onBack,
}: {
  rows: OlevelRow[];
  onRows: (v: OlevelRow[]) => void;
  stateOfOrigin: string;
  onState: (v: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [extractedCount, setExtractedCount] = useState<number | null>(null);

  const setRow = (i: number, key: keyof OlevelRow, val: string) => {
    const next = rows.map((r, idx) => (idx === i ? { ...r, [key]: val } : r));
    onRows(next);
  };
  const addRow = () => onRows([...rows, { subject: '', grade: '' }]);
  const removeRow = (i: number) => onRows(rows.filter((_, idx) => idx !== i));

  const handleOcr = (text: string) => {
    const parsed = parseOLevelResult(text);
    setExtractedCount(parsed.length);
    if (!parsed.length) return;
    const next = rows.map((r) => ({ ...r }));
    while (next.length < parsed.length) next.push({ subject: '', grade: '' });
    parsed.forEach((r, i) => {
      next[i] = { subject: r.subject, grade: r.grade };
    });
    onRows(next);
  };

  const filled = rows.filter((r) => r.subject && r.grade).length;
  const canContinue = filled >= 5 && !!stateOfOrigin;

  return (
    <StepFrame
      eyebrow="Step 4"
      title="Your O/Level results"
      subtitle="Enter at least 5 subjects with grades. We'll pick your best-five combination automatically."
    >
      <Card className="p-6 md:p-8">
        <OcrUpload
          label="Upload your WAEC/NECO result"
          hint="Click or drag & drop — JPG, PNG or PDF. We'll auto-fill your subjects & grades."
          onText={handleOcr}
          renderResult={
            extractedCount && extractedCount > 0 ? (
              <p className="text-xs font-semibold text-slate-600">
                {extractedCount} subject{extractedCount === 1 ? '' : 's'} filled in below —
                check them over.
              </p>
            ) : (
              <p className="text-xs font-semibold text-amber-600">
                Couldn't read the subjects — please fill them in manually below.
              </p>
            )
          }
        />
        <label className="mb-2 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
          <MapPin className="h-4 w-4" /> State of origin (for catchment)
        </label>
        <select
          value={stateOfOrigin}
          onChange={(e) => onState(e.target.value)}
          className="mb-6 w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
        >
          <option value="">Select your state…</option>
          {ALL_STATES.map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>

        <div className="space-y-2.5">
          {rows.map((r, i) => (
            <div key={i} className="flex items-center gap-2">
              <select
                value={r.subject}
                onChange={(e) => setRow(i, 'subject', e.target.value)}
                className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-sm font-semibold text-slate-900 outline-none focus:border-teal-400 focus:bg-white"
              >
                <option value="">Subject…</option>
                {SUBJECTS.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
              <select
                value={r.grade}
                onChange={(e) => setRow(i, 'grade', e.target.value)}
                className="w-24 shrink-0 rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-sm font-bold text-slate-900 outline-none focus:border-teal-400 focus:bg-white"
              >
                <option value="">Grade</option>
                {GRADES.map((g) => (
                  <option key={g.value} value={g.value}>
                    {g.label}
                  </option>
                ))}
              </select>
              <button
                onClick={() => removeRow(i)}
                disabled={rows.length <= 5}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-slate-300 transition hover:bg-rose-50 hover:text-rose-500 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={addRow}
            className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-black uppercase tracking-wide text-teal-600 transition hover:bg-teal-50"
          >
            <Plus className="h-4 w-4" /> Add subject
          </button>
          <span
            className={`text-xs font-bold ${filled >= 5 ? 'text-emerald-600' : 'text-slate-400'}`}
          >
            {filled}/5 minimum
          </span>
        </div>
      </Card>
      <div className="mt-6 flex items-center justify-between">
        <GhostButton onClick={onBack}>
          <ArrowLeft className="h-4 w-4" /> Back
        </GhostButton>
        <PrimaryButton onClick={onNext} disabled={!canContinue}>
          Continue <ArrowRight className="h-4 w-4" />
        </PrimaryButton>
      </div>
    </StepFrame>
  );
}

// ── Step 5: Post-UTME ─────────────────────────────────────────────────────
export function StepPostUtme({
  score,
  onScore,
  onNext,
  onBack,
}: {
  score: string;
  onScore: (v: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const n = parseFloat(score);
  const valid = score !== '' && !isNaN(n) && n >= 0 && n <= 30;

  return (
    <StepFrame
      eyebrow="Step 5 — last one"
      title="Your Post-UTME score"
      subtitle="Enter your UNILAG Post-UTME (screening) result, out of 30. We'll work out your final aggregate and whether you're in."
    >
      <Card className="p-6 md:p-8">
        <label className="mb-2 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
          <Hash className="h-4 w-4" /> Post-UTME score (out of 30)
        </label>
        <input
          autoFocus
          inputMode="decimal"
          value={score}
          onChange={(e) => onScore(e.target.value.replace(/[^0-9.]/g, ''))}
          onKeyDown={(e) => e.key === 'Enter' && valid && onNext()}
          placeholder="e.g. 24"
          className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-5 py-4 text-2xl font-black tracking-tight text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
        />
        {score && !valid && (
          <p className="mt-2 text-xs font-bold text-rose-500">Score must be between 0 and 30.</p>
        )}
        <p className="mt-3 text-xs font-medium text-slate-400">
          This is your actual screening score — not a prediction. We add it to your UTME and
          O/Level points for your aggregate out of 100.
        </p>
      </Card>
      <div className="mt-6 flex items-center justify-between">
        <GhostButton onClick={onBack}>
          <ArrowLeft className="h-4 w-4" /> Back
        </GhostButton>
        <PrimaryButton onClick={onNext} disabled={!valid}>
          See my results <ArrowRight className="h-4 w-4" />
        </PrimaryButton>
      </div>
    </StepFrame>
  );
}
