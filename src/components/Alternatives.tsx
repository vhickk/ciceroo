import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  Calculator,
  Sparkles,
  Layers,
  GraduationCap,
  Download,
} from 'lucide-react';
import {
  findAlternativeProgrammes,
  analyseProgramme,
  type AltItem,
  type Analysis,
  type OlevelEntry,
  type StudentInput,
} from '../lib/scoring';
import type { Programme } from '../data/programmes';
import {
  facultyMeta,
  facultyShort,
  BAND_STYLE,
  CHANCE_STYLE,
  coursePaint,
} from '../lib/ui';
import { Card } from './ui';
import { CombinationCheck } from './ComboCheck';
import { generateFacultyPDF, generateFullReportPDF } from '../lib/pdf';

// ── Aggregate headline copy, shared by course card + detail ───────────────
function aggCopy(a: Analysis): { big: string; sub: string } {
  const big = a.aggregate.toFixed(1);
  if (a.merit <= 0)
    return { big, sub: `Aggregate ${big} / 100 — no cut-off on record yet.` };
  const gap = Math.abs(a.margin ?? 0).toFixed(1);
  if (a.admitted)
    return { big, sub: `${big} clears the ${a.cutLabel} by ${gap}. You're in.` };
  if (a.band === 'close')
    return { big, sub: `${big} — just ${gap} below the ${a.cutLabel}. Borderline.` };
  return { big, sub: `${big} — ${gap} below the ${a.cutLabel}.` };
}

const slide = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
  transition: { duration: 0.3 },
};

export function Alternatives({
  name,
  input,
  studentResults,
  onBack,
}: {
  name: string;
  input: StudentInput;
  studentResults: OlevelEntry[];
  onBack: () => void;
}) {
  const { grouped, sortedFaculties, total } = useMemo(
    () => findAlternativeProgrammes(studentResults, input),
    [input, studentResults],
  );
  const [faculty, setFaculty] = useState<string | null>(null);
  const [course, setCourse] = useState<Programme | null>(null);

  const downloadFaculty = (fac: string) =>
    generateFacultyPDF(name, input, studentResults, fac, grouped[fac] ?? []);
  const downloadAll = () =>
    generateFullReportPDF(name, input, studentResults, grouped, sortedFaculties);

  const goFaculties = () => {
    setCourse(null);
    setFaculty(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const goCourses = (fac: string) => {
    setFaculty(fac);
    setCourse(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const goDetail = (prog: Programme) => {
    setCourse(prog);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const level: 'faculties' | 'courses' | 'detail' = course
    ? 'detail'
    : faculty
      ? 'courses'
      : 'faculties';

  return (
    <div className="space-y-6">
      {/* ── Breadcrumb + back ── */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-400">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-slate-600 ring-1 ring-slate-200 transition hover:text-slate-900"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Results
        </button>
        <ChevronRight className="h-3.5 w-3.5" />
        <button
          onClick={goFaculties}
          className={`rounded-full px-3 py-1.5 transition ${
            level === 'faculties'
              ? 'bg-teal-50 text-teal-700 ring-1 ring-teal-100'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Faculties
        </button>
        {faculty && (
          <>
            <ChevronRight className="h-3.5 w-3.5" />
            <button
              onClick={() => goCourses(faculty)}
              className={`max-w-[45vw] truncate rounded-full px-3 py-1.5 transition ${
                level === 'courses'
                  ? 'bg-teal-50 text-teal-700 ring-1 ring-teal-100'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {facultyShort(faculty)}
            </button>
          </>
        )}
        {course && (
          <>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="max-w-[45vw] truncate rounded-full bg-teal-50 px-3 py-1.5 text-teal-700 ring-1 ring-teal-100">
              {course.name}
            </span>
          </>
        )}
      </div>

      <AnimatePresence mode="wait">
        {level === 'faculties' && (
          <motion.div key="faculties" {...slide}>
            <FacultiesView
              grouped={grouped}
              sortedFaculties={sortedFaculties}
              total={total}
              onPick={goCourses}
              onDownload={downloadFaculty}
              onDownloadAll={downloadAll}
            />
          </motion.div>
        )}
        {level === 'courses' && faculty && (
          <motion.div key="courses" {...slide}>
            <CoursesView
              faculty={faculty}
              items={grouped[faculty] ?? []}
              onPick={goDetail}
              onDownload={() => downloadFaculty(faculty)}
            />
          </motion.div>
        )}
        {level === 'detail' && course && (
          <motion.div key={`detail-${course.name}`} {...slide}>
            <DetailView
              prog={course}
              input={input}
              studentResults={studentResults}
              onBack={() => faculty && goCourses(faculty)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Level 1: faculty cards ────────────────────────────────────────────────
function FacultiesView({
  grouped,
  sortedFaculties,
  total,
  onPick,
  onDownload,
  onDownloadAll,
}: {
  grouped: Record<string, AltItem[]>;
  sortedFaculties: string[];
  total: number;
  onPick: (fac: string) => void;
  onDownload: (fac: string) => void;
  onDownloadAll: () => void;
}) {
  if (total === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-sm font-semibold text-amber-700">
          No other programmes match your current O/Level combination yet. Try adding more
          subjects, or talk to us for guidance.
        </p>
      </Card>
    );
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="mb-1 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.18em] text-teal-600">
            <Layers className="h-4 w-4" /> Alternative faculties
          </div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 md:text-3xl">
            You may qualify for {total} other course{total !== 1 ? 's' : ''}
          </h2>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Explore by faculty. Tap a faculty to see its courses, then a course for the full
            breakdown.
          </p>
        </div>
        <button
          onClick={onDownloadAll}
          className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-xs font-black text-white shadow-lg transition hover:bg-slate-800"
        >
          <Download className="h-4 w-4" /> Download all faculties (PDF)
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 md:gap-7">
        {sortedFaculties.map((fac, i) => {
          const meta = facultyMeta(fac);
          const Icon = meta.icon;
          const paint = coursePaint(i);
          const items = grouped[fac];
          const high = items.filter((it) => it.admitted).length;
          return (
            <motion.div
              key={fac}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.45 }}
              whileHover={{ scale: 1.02, y: -6 }}
              role="button"
              tabIndex={0}
              onClick={() => onPick(fac)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onPick(fac);
                }
              }}
              className="group relative flex min-h-[360px] cursor-pointer flex-col overflow-hidden rounded-[2rem] border border-slate-100 bg-white text-left shadow-[0_20px_50px_-24px_rgba(15,23,42,0.2)] transition-shadow hover:shadow-[0_34px_80px_-24px_rgba(15,23,42,0.32)]"
            >
              {/* slim coloured top bar */}
              <div className={`h-2 w-full shrink-0 bg-gradient-to-r ${paint.bar}`} />
              {/* faded decorative shapes */}
              <div className={`pointer-events-none absolute -bottom-10 -right-10 h-52 w-52 rounded-full ${paint.wash} opacity-60`} />
              <Icon
                className={`pointer-events-none absolute -bottom-5 -right-3 h-48 w-48 ${paint.mark} transition-transform duration-700 group-hover:scale-105`}
                strokeWidth={1.25}
              />

              <div className="relative flex flex-1 flex-col p-7">
                <div className="flex items-start justify-between">
                  <span
                    className={`grid h-16 w-16 place-items-center rounded-2xl ${paint.tintBg} ${paint.tintText} shadow-sm transition-transform duration-500 group-hover:rotate-6`}
                  >
                    <Icon className="h-8 w-8" />
                  </span>
                  {high > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-black uppercase tracking-wide text-emerald-600 ring-1 ring-emerald-100">
                      <Sparkles className="h-3.5 w-3.5" /> {high} you're in
                    </span>
                  )}
                </div>

                <div className="mt-auto">
                  <h3 className="text-2xl font-black leading-tight tracking-tight text-slate-900 md:text-[1.75rem]">
                    {facultyShort(fac)}
                  </h3>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                      {items.length} course{items.length !== 1 ? 's' : ''} available
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDownload(fac);
                        }}
                        title={`Download ${facultyShort(fac)} courses (PDF)`}
                        className={`inline-flex items-center gap-1.5 rounded-full ${paint.tintBg} ${paint.tintText} px-3 py-2 text-[11px] font-black uppercase tracking-wide transition hover:brightness-95`}
                      >
                        <Download className="h-3.5 w-3.5" /> PDF
                      </button>
                      <span
                        className={`inline-flex h-10 w-10 items-center justify-center rounded-full ${paint.tintBg} ${paint.tintText} transition-transform duration-300 group-hover:translate-x-1`}
                      >
                        <ArrowRight className="h-5 w-5" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ── Level 2: course cards within a faculty ────────────────────────────────
function CoursesView({
  faculty,
  items,
  onPick,
  onDownload,
}: {
  faculty: string;
  items: AltItem[];
  onPick: (prog: Programme) => void;
  onDownload: () => void;
}) {
  const meta = facultyMeta(faculty);
  const Icon = meta.icon;

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${meta.grad} text-white shadow-lg`}
          >
            <Icon className="h-6 w-6" />
          </span>
          <div>
            <div className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
              {items.length} course{items.length !== 1 ? 's' : ''} you qualify for
            </div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 md:text-3xl">
              {facultyShort(faculty)}
            </h2>
          </div>
        </div>
        <button
          type="button"
          onClick={onDownload}
          className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-black text-white shadow-lg transition hover:bg-slate-800"
        >
          <Download className="h-4 w-4" /> Download report
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 md:gap-7">
        {items.map((it, i) => {
          const paint = coursePaint(i);
          const chance = CHANCE_STYLE[it.chance];
          const WIcon = facultyMeta(it.prog.faculty).icon;
          const big = it.aggregate.toFixed(1);
          return (
            <motion.button
              key={it.prog.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.45 }}
              whileHover={{ scale: 1.02, y: -6 }}
              onClick={() => onPick(it.prog)}
              className="group relative flex min-h-[360px] flex-col overflow-hidden rounded-[2rem] border border-slate-100 bg-white text-left shadow-[0_20px_50px_-24px_rgba(15,23,42,0.2)] transition-shadow hover:shadow-[0_34px_80px_-24px_rgba(15,23,42,0.32)]"
            >
              {/* slim coloured top bar */}
              <div className={`h-2 w-full shrink-0 bg-gradient-to-r ${paint.bar}`} />
              {/* faded decorative shapes */}
              <div className={`pointer-events-none absolute -bottom-10 -right-10 h-52 w-52 rounded-full ${paint.wash} opacity-60`} />
              <WIcon
                className={`pointer-events-none absolute -bottom-5 -right-3 h-48 w-48 ${paint.mark} transition-transform duration-700 group-hover:scale-105`}
                strokeWidth={1.25}
              />

              <div className="relative flex flex-1 flex-col p-7">
                <div className="flex items-start justify-between">
                  <span
                    className={`grid h-16 w-16 place-items-center rounded-2xl ${paint.tintBg} ${paint.tintText} shadow-sm transition-transform duration-500 group-hover:rotate-6`}
                  >
                    <GraduationCap className="h-8 w-8" />
                  </span>
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-black uppercase tracking-wide ring-1 ${chance.chip}`}>
                    <span className={`h-2 w-2 rounded-full ${chance.dot}`} /> {chance.label}
                  </span>
                </div>

                <div className="mt-auto">
                  <div className="mb-1 text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                    {facultyShort(it.prog.faculty)}
                  </div>
                  <h3 className="text-xl font-black leading-tight tracking-tight text-slate-900 md:text-2xl">
                    {it.prog.name}
                  </h3>
                  <div className="mt-3 flex items-end justify-between">
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                        Your aggregate
                      </div>
                      <div className={`text-4xl font-black leading-none tracking-tighter tabular-nums ${paint.tintText}`}>
                        {big}
                        <span className="text-lg font-bold text-slate-400"> /100</span>
                      </div>
                    </div>
                    <span
                      className={`inline-flex h-10 w-10 items-center justify-center rounded-full ${paint.tintBg} ${paint.tintText} transition-transform duration-300 group-hover:translate-x-1`}
                    >
                      <ArrowRight className="h-5 w-5" />
                    </span>
                  </div>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ── Level 3: full course detail ───────────────────────────────────────────
function DetailView({
  prog,
  input,
  studentResults,
  onBack,
}: {
  prog: Programme;
  input: StudentInput;
  studentResults: OlevelEntry[];
  onBack: () => void;
}) {
  const a = analyseProgramme(prog, input, studentResults);
  const meta = facultyMeta(prog.faculty);
  const FacIcon = meta.icon;
  const band = BAND_STYLE[a.band];
  const { big, sub } = aggCopy(a);

  return (
    <div className="space-y-6">
      {/* hero */}
      <div
        className={`relative overflow-hidden rounded-[2rem] border ${band.ring} bg-white p-6 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.25)] md:p-8`}
      >
        <div className={`absolute -right-16 -top-16 h-56 w-56 rounded-full ${band.blob} blur-3xl`} />
        <div className="relative">
          <div className="mb-6 flex items-center gap-3">
            <span
              className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${meta.grad} text-white shadow-lg`}
            >
              <FacIcon className="h-6 w-6" />
            </span>
            <div>
              <div className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                {facultyShort(prog.faculty)}
              </div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900 md:text-3xl">
                {prog.name}
              </h2>
            </div>
          </div>

          <div className="grid items-center gap-6 md:grid-cols-[auto_1fr]">
            <div
              className={`rounded-[1.75rem] bg-gradient-to-br ${band.grad} px-8 py-7 text-center text-white shadow-2xl ${band.shadow}`}
            >
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/80">
                Your aggregate
              </div>
              <div className="mt-1 text-6xl font-black leading-none tracking-tighter tabular-nums">
                {big}
                <span className="text-2xl font-bold text-white/70"> /100</span>
              </div>
              <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em]">
                <Sparkles className="h-3 w-3" /> {band.label}
                {a.primaryCut !== null && ` · cut-off ${a.primaryCut}`}
              </div>
            </div>
            <p className="max-w-md text-base font-medium leading-relaxed text-slate-600">
              {sub}
            </p>
          </div>
        </div>
      </div>

      {/* combination checks */}
      <CombinationCheck prog={prog} input={input} studentResults={studentResults} analysis={a} />

      {/* score breakdown */}
      <Card className="p-6">
        <div className="mb-3 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-teal-600">
          <Calculator className="h-3.5 w-3.5" /> Score breakdown
        </div>
        <Row label="UTME contribution" value={`${a.utmeContrib.toFixed(1)} / 50`} />
        <Row label="O/Level best-5" value={`${a.olevelPts.toFixed(1)} / 20`} />
        <Row label="Post-UTME" value={`${a.postUtmeContrib.toFixed(1)} / 30`} />
        <Row label="Your aggregate" value={`${a.aggregate.toFixed(1)} / 100`} />
        <Row label="Merit cut-off" value={a.merit > 0 ? `${a.merit}` : 'No data'} />
        {a.catchmentScore !== null && (
          <Row label={`${input.stateOfOrigin} catchment`} value={`${a.catchmentScore}`} last />
        )}
      </Card>

      <div className="flex justify-center pt-1">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" /> Back to courses
        </button>
      </div>
    </div>
  );
}

function Row({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <div
      className={`flex items-center justify-between py-2 text-sm ${
        last ? '' : 'border-b border-slate-100'
      }`}
    >
      <span className="font-semibold text-slate-500">{label}</span>
      <span className="font-black text-slate-900 tabular-nums">{value}</span>
    </div>
  );
}
