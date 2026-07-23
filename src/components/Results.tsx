import { motion } from 'motion/react';
import {
  Target,
  Gauge,
  BookOpen,
  Award,
  MapPin,
  Phone,
  RotateCcw,
  Pencil,
  AlertTriangle,
  Sparkles,
  Download,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { PROGRAMMES } from '../data/programmes';
import {
  analyseProgramme,
  findAlternativeProgrammes,
  type OlevelEntry,
  type StudentInput,
} from '../lib/scoring';
import { generatePDF } from '../lib/pdf';
import { facultyMeta, facultyShort, BAND_STYLE } from '../lib/ui';
import { Card, StatTile, SectionLabel, PrimaryButton, GhostButton } from './ui';
import { CombinationCheck } from './ComboCheck';

export function Results({
  name,
  input,
  studentResults,
  onEdit,
  onRestart,
  onExplore,
}: {
  name: string;
  input: StudentInput;
  studentResults: OlevelEntry[];
  onEdit: () => void;
  onRestart: () => void;
  onExplore: () => void;
}) {
  const prog = PROGRAMMES.find((p) => p.name === input.programmeName)!;
  const a = analyseProgramme(prog, input, studentResults);
  const alt = findAlternativeProgrammes(studentResults, input);
  const meta = facultyMeta(prog.faculty);
  const FacIcon = meta.icon;
  const band = BAND_STYLE[a.band];
  const eligible = a.utmeOk && a.olevelOk;

  // Hero number + copy — no assumptions, just the required Post-UTME.
  let big: string;
  let sub: string;
  if (a.merit <= 0) {
    big = '?';
    sub = `No current cut-off on record for ${prog.name}. Talk to us and we'll tell you the exact Post-UTME target.`;
  } else if (a.band === 'secured') {
    big = '0';
    sub = `Your UTME + O/Level score already clears the ${a.cutLabel}. Any Post-UTME score keeps you in.`;
  } else if (a.band === 'unreachable') {
    big = '30+';
    sub = `Even a perfect 30/30 would leave you ${(a.neededPostUtme! - 30).toFixed(1)} short of the ${a.cutLabel}. This course is out of reach on these scores.`;
  } else {
    big = a.neededPostUtme!.toFixed(1);
    sub = `Score at least this in your Post-UTME to reach the ${a.cutLabel}.`;
  }

  // Path-to-admission bar segments (out of 100)
  const target = a.primaryCut ?? 0;
  const olevelW = a.olevelPts;
  const utmeW = a.utmeContrib;
  const needW =
    a.neededPostUtme && a.neededPostUtme > 0 ? Math.min(a.neededPostUtme, 30) : 0;

  return (
    <div className="space-y-8">
      {/* ── HERO ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`relative overflow-hidden rounded-[2rem] border ${band.ring} bg-white p-6 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.25)] md:p-10`}
      >
        <div className={`absolute -right-16 -top-16 h-64 w-64 rounded-full ${band.blob} blur-3xl`} />
        <div className="relative">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <span
              className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${meta.grad} text-white shadow-lg`}
            >
              <FacIcon className="h-6 w-6" />
            </span>
            <div>
              <div className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                {name ? `${name}'s results` : 'Your results'} · {facultyShort(prog.faculty)}
              </div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 md:text-4xl">
                {prog.name}
              </h1>
            </div>
          </div>

          {!eligible && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-rose-100 bg-rose-50 p-4">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-rose-500" />
              <p className="text-sm font-semibold text-rose-700">
                Your {!a.utmeOk ? 'UTME' : 'O/Level'} subject combination isn't correct for this
                course yet. Fix it below — the Post-UTME target only counts once your combination
                qualifies.
              </p>
            </div>
          )}

          <div className="grid items-center gap-6 md:grid-cols-[auto_1fr]">
            <div
              className={`rounded-[1.75rem] bg-gradient-to-br ${band.grad} px-8 py-7 text-center text-white shadow-2xl ${band.shadow}`}
            >
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/80">
                Post-UTME you need
              </div>
              <div className="mt-1 text-6xl font-black leading-none tracking-tighter tabular-nums md:text-7xl">
                {big}
                {big !== '?' && <span className="text-2xl font-bold text-white/70"> /30</span>}
              </div>
              <div
                className={`mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em]`}
              >
                <Sparkles className="h-3 w-3" /> {band.label}
              </div>
            </div>
            <p className="max-w-md text-base font-medium leading-relaxed text-slate-600 md:text-lg">
              {sub}
            </p>
          </div>
        </div>
      </motion.div>

      {/* ── PATH TO ADMISSION BAR ── */}
      {a.merit > 0 && (
        <Card className="p-6 md:p-8">
          <SectionLabel icon={Gauge}>Your path to the cut-off</SectionLabel>
          <div className="relative mt-6 h-11 w-full overflow-hidden rounded-2xl bg-slate-100">
            <div className="flex h-full">
              <div
                className="flex h-full items-center justify-center bg-teal-500 text-[10px] font-black text-white"
                style={{ width: `${olevelW}%` }}
                title="O/Level"
              >
                {olevelW > 7 ? 'O/L' : ''}
              </div>
              <div
                className="flex h-full items-center justify-center bg-cyan-500 text-[10px] font-black text-white"
                style={{ width: `${utmeW}%` }}
                title="UTME"
              >
                {utmeW > 10 ? 'UTME' : ''}
              </div>
              {needW > 0 && (
                <div
                  className="flex h-full items-center justify-center bg-amber-400 bg-[repeating-linear-gradient(45deg,transparent,transparent_6px,rgba(255,255,255,0.35)_6px,rgba(255,255,255,0.35)_12px)] text-[10px] font-black text-amber-900"
                  style={{ width: `${needW}%` }}
                  title="Post-UTME needed"
                >
                  {needW > 8 ? 'Post-UTME' : ''}
                </div>
              )}
            </div>
            {/* cut-off marker */}
            <div
              className="absolute top-0 h-full border-l-2 border-dashed border-slate-900"
              style={{ left: `${Math.min(target, 100)}%` }}
            >
              <span className="absolute -top-0 left-1 whitespace-nowrap text-[9px] font-black text-slate-900">
                cut-off {target}
              </span>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-4 text-xs font-bold text-slate-500">
            <Legend color="bg-teal-500" label={`O/Level ${a.olevelPts.toFixed(1)}`} />
            <Legend color="bg-cyan-500" label={`UTME ${a.utmeContrib.toFixed(1)}`} />
            {needW > 0 && <Legend color="bg-amber-400" label={`Post-UTME ${needW.toFixed(1)}`} />}
          </div>
        </Card>
      )}

      {/* ── STAT TILES ── */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatTile
          icon={Award}
          tone="teal"
          label="Score so far"
          value={`${a.scored.toFixed(1)}`}
          sub="out of 70 (pre Post-UTME)"
          delay={0.05}
        />
        <StatTile
          icon={Gauge}
          tone="cyan"
          label="UTME points"
          value={a.utmeContrib.toFixed(1)}
          sub={`${input.utmeScore || 0} ÷ 8 · /50`}
          delay={0.1}
        />
        <StatTile
          icon={BookOpen}
          tone="violet"
          label="O/Level best-5"
          value={a.olevelPts.toFixed(1)}
          sub="out of 20"
          delay={0.15}
        />
        <StatTile
          icon={MapPin}
          tone={a.catchmentScore !== null ? 'emerald' : 'slate'}
          label={a.catchmentScore !== null ? `${input.stateOfOrigin} cut-off` : 'Merit cut-off'}
          value={a.merit > 0 ? (a.catchmentScore ?? a.merit) : '—'}
          sub={a.merit > 0 ? `merit ${a.merit}` : 'no data'}
          delay={0.2}
        />
      </div>

      {/* ── COMBINATION CHECK ── */}
      <CombinationCheck prog={prog} input={input} studentResults={studentResults} analysis={a} />

      {/* ── CONTACT CTA ── */}
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-center text-white">
        <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-teal-500/20 blur-3xl" />
        <div className="relative">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-white/10">
            <Phone className="h-7 w-7" />
          </div>
          <h3 className="text-xl font-black tracking-tight">Talk to an admission expert</h3>
          <p className="mx-auto mt-2 max-w-md text-sm font-medium text-white/70">
            Personalised guidance on course selection, UTME prep and Post-UTME coaching from Skujy
            Tutorials.
          </p>
          <a
            href="tel:09069882502"
            className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-black text-slate-900 transition hover:bg-slate-100"
          >
            <Phone className="h-4 w-4" /> Call 09069882502
          </a>
        </div>
      </div>

      {/* ── EXPLORE ALTERNATIVES (own page) ── */}
      {alt.total > 0 && (
        <motion.button
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          whileHover={{ scale: 1.01, y: -3 }}
          onClick={onExplore}
          className="group relative w-full overflow-hidden rounded-[2rem] bg-gradient-to-br from-teal-500 via-cyan-500 to-sky-500 p-6 text-left text-white shadow-[0_28px_70px_-28px_rgba(13,148,136,0.7)] md:p-8"
        >
          <div className="pointer-events-none absolute -right-12 -top-12 h-52 w-52 rounded-full bg-white/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 left-10 h-52 w-52 rounded-full bg-black/10 blur-3xl" />
          <div className="relative flex items-center gap-5">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-white/25 bg-white/15 shadow-lg transition-transform duration-500 group-hover:rotate-6">
              <Layers className="h-7 w-7" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-black uppercase tracking-[0.18em] text-white/80">
                Explore alternative faculties
              </div>
              <h2 className="mt-0.5 text-xl font-black leading-tight tracking-tight md:text-2xl">
                You may qualify for {alt.total} other course{alt.total !== 1 ? 's' : ''}
              </h2>
              <p className="mt-1 text-sm font-medium text-white/85">
                Browse faculty by faculty, then course by course — see exactly what each one needs.
              </p>
            </div>
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/20 transition-transform duration-300 group-hover:translate-x-1">
              <ArrowRight className="h-5 w-5" />
            </span>
          </div>
        </motion.button>
      )}

      {/* ── ACTIONS ── */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <GhostButton onClick={onEdit}>
          <Pencil className="h-4 w-4" /> Edit my answers
        </GhostButton>
        <GhostButton onClick={() => generatePDF(name, input, studentResults, a)}>
          <Download className="h-4 w-4" /> Download report
        </GhostButton>
        <PrimaryButton onClick={onRestart}>
          <RotateCcw className="h-4 w-4" /> Start over
        </PrimaryButton>
      </div>

      <p className="px-4 text-center text-[11px] leading-relaxed text-slate-400">
        For estimation only. Actual cut-offs vary each year — always verify with the official UNILAG
        admissions portal. Cut-off data referenced from 2024/2025 figures.
      </p>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`h-3 w-3 rounded ${color}`} /> {label}
    </span>
  );
}
