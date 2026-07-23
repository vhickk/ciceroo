import {
  GRADES,
  SUBJECTS,
  NORM_MAP,
  PROGRAMMES,
  type Programme,
  type ReqGroup,
} from '../data/programmes';

// ── O/Level result shape used across the app ──────────────────────────────
export interface OlevelEntry {
  subject: string;
  grade: string;
  points: number;
}

export interface StudentInput {
  utmeScore: string;
  utmeSubjects: string[]; // up to 4
  stateOfOrigin: string; // "Lagos" | ... | "Other" | ""
  programmeName?: string; // the currently chosen programme (excluded from suggestions)
}

// ── Basic helpers ─────────────────────────────────────────────────────────
export function gradeToPoints(grade: string): number {
  const g = GRADES.find((x) => x.value === grade);
  return g ? g.pts : 0;
}

export function normalizeSubject(s: string): string {
  const lower = s.trim().toLowerCase();
  if (NORM_MAP[lower]) return NORM_MAP[lower];
  const match = SUBJECTS.find((sub) => sub.toLowerCase() === lower);
  if (match) return match;
  const partial = SUBJECTS.find(
    (sub) => sub.toLowerCase().includes(lower) && lower.length > 3,
  );
  if (partial) return partial;
  return s.trim();
}

// ── Best-five O/Level selection against a requirement set ─────────────────
export interface BestFive {
  valid: boolean;
  selected?: (OlevelEntry & { origIdx: number })[];
  totalPoints?: number;
  error?: string;
  usedByGroup?: { groupLabel?: string; subjects: (OlevelEntry & { origIdx: number })[] }[];
}

export function findBestFive(
  studentResults: OlevelEntry[],
  requirements: ReqGroup[],
): BestFive {
  const validResults = studentResults.filter((r) => r.points > 0);
  const used = new Set<number>();
  const selected: (OlevelEntry & { origIdx: number })[] = [];
  const usedByGroup: BestFive['usedByGroup'] = [];

  for (const group of requirements) {
    let candidates: (OlevelEntry & { origIdx: number })[];
    if (group.subjects.includes('__ANY__')) {
      candidates = validResults
        .filter((r) => !used.has(studentResults.indexOf(r)))
        .map((r) => ({ ...r, origIdx: studentResults.indexOf(r) }));
    } else {
      candidates = validResults
        .filter(
          (r) =>
            group.subjects.includes(r.subject) &&
            !used.has(studentResults.indexOf(r)),
        )
        .map((r) => ({ ...r, origIdx: studentResults.indexOf(r) }));
    }

    candidates.sort((a, b) => b.points - a.points);
    const picked = candidates.slice(0, group.count);

    if (picked.length < group.count) {
      return {
        valid: false,
        error: `Missing required subject for: "${group.label}". You need ${group.count} subject(s) from [${group.subjects.join(
          ', ',
        )}] but only found ${picked.length} passing grade(s).`,
      };
    }

    picked.forEach((p) => used.add(p.origIdx));
    selected.push(...picked);
    usedByGroup!.push({ groupLabel: group.label, subjects: picked });
  }

  const totalPoints = selected.reduce((s, r) => s + r.points, 0);
  return { valid: true, selected, totalPoints, usedByGroup };
}

// ── UTME subject-combination check ────────────────────────────────────────
export interface UtmeCheck {
  valid: boolean;
  missing: string[];
}

export function checkUTMESubjects(
  studentSubjects: string[],
  utmeReqs: ReqGroup[] | undefined,
): UtmeCheck {
  if (!utmeReqs || utmeReqs.length === 0) return { valid: true, missing: [] };

  const available = [...studentSubjects.filter((s) => s)];
  const used = new Set<number>();
  const missing: string[] = [];

  for (const group of utmeReqs) {
    let filled = 0;
    const needed = group.count;

    if (group.subjects.includes('__ANY__')) {
      for (let i = 0; i < available.length && filled < needed; i++) {
        if (!used.has(i)) {
          used.add(i);
          filled++;
        }
      }
    } else {
      for (let i = 0; i < available.length && filled < needed; i++) {
        if (!used.has(i) && group.subjects.includes(available[i])) {
          used.add(i);
          filled++;
        }
      }
    }

    if (filled < needed) {
      const shortfall = needed - filled;
      const opts = group.subjects.includes('__ANY__')
        ? 'any subject'
        : group.subjects.join(' / ');
      missing.push(`${shortfall} of: ${opts}`);
    }
  }

  return { valid: missing.length === 0, missing };
}

// ── Central per-programme analysis (assumption-free Post-UTME target) ─────
export type Band =
  | 'secured' // already clears the cut-off, 0 Post-UTME needed
  | 'strong' // low Post-UTME needed
  | 'reachable' // moderate Post-UTME needed
  | 'stretch' // high Post-UTME needed but < 30
  | 'unreachable' // even 30/30 falls short
  | 'unknown'; // no cut-off data

export type Chance = 'high' | 'med' | 'low' | 'none' | 'unknown';

export interface Analysis {
  prog: Programme;
  utmeContrib: number; // /50
  olevelPts: number; // /20
  scored: number; // /70 (UTME + O/Level, no Post-UTME)
  merit: number;
  catchmentScore: number | null;
  primaryCut: number | null; // the easier of merit / catchment
  cutLabel: string;
  neededPostUtme: number | null; // /30 required (may exceed 30 => unreachable)
  band: Band;
  chance: Chance;
  utmeOk: boolean;
  utmeMissing: string[];
  olevelChecked: boolean;
  olevelOk: boolean;
}

const bandToChance: Record<Band, Chance> = {
  secured: 'high',
  strong: 'high',
  reachable: 'med',
  stretch: 'low',
  unreachable: 'none',
  unknown: 'unknown',
};

export function analyseProgramme(
  prog: Programme,
  input: StudentInput,
  studentResults: OlevelEntry[],
  olevelPtsOverride?: number,
): Analysis {
  const utme = parseFloat(input.utmeScore) || 0;
  const utmeContrib = Math.min(utme / 8, 50);

  const olevelCheck =
    studentResults.length >= 5 ? findBestFive(studentResults, prog.requirements) : null;
  const olevelPts =
    olevelPtsOverride ??
    (olevelCheck && olevelCheck.valid ? olevelCheck.totalPoints! : 0);
  const scored = utmeContrib + olevelPts;

  const catchmentScore =
    input.stateOfOrigin &&
    input.stateOfOrigin !== 'Other' &&
    prog.catchment[input.stateOfOrigin] !== undefined
      ? prog.catchment[input.stateOfOrigin]
      : null;

  const merit = prog.merit;
  const utmeCheck = checkUTMESubjects(input.utmeSubjects, prog.utmeReqs);

  let primaryCut: number | null = null;
  let cutLabel = '';
  let neededPostUtme: number | null = null;
  let band: Band = 'unknown';

  if (merit > 0) {
    primaryCut =
      catchmentScore !== null ? Math.min(merit, catchmentScore) : merit;
    cutLabel =
      catchmentScore !== null && catchmentScore < merit
        ? `${input.stateOfOrigin} catchment (${catchmentScore})`
        : `merit cut-off (${merit})`;
    neededPostUtme = +(primaryCut - scored).toFixed(2);
    if (neededPostUtme <= 0) band = 'secured';
    else if (neededPostUtme > 30) band = 'unreachable';
    else if (neededPostUtme <= 15) band = 'strong';
    else if (neededPostUtme <= 24) band = 'reachable';
    else band = 'stretch';
  }

  return {
    prog,
    utmeContrib,
    olevelPts,
    scored,
    merit,
    catchmentScore,
    primaryCut,
    cutLabel,
    neededPostUtme,
    band,
    chance: bandToChance[band],
    utmeOk: utmeCheck.valid,
    utmeMissing: utmeCheck.missing,
    olevelChecked: !!olevelCheck,
    olevelOk: !!(olevelCheck && olevelCheck.valid),
  };
}

// ── Alternative-programme finder (grouped by faculty) ─────────────────────
export interface AltItem {
  prog: Programme;
  olevelPts: number;
  scored: number;
  neededPostUtme: number | null;
  band: Band;
  chance: Chance;
}

export interface AltResult {
  grouped: Record<string, AltItem[]>;
  sortedFaculties: string[];
  total: number;
}

export function findAlternativeProgrammes(
  studentResults: OlevelEntry[],
  input: StudentInput,
): AltResult {
  const items: AltItem[] = [];
  const filledUtme = input.utmeSubjects.filter((s) => s);

  for (const prog of PROGRAMMES) {
    if (input.programmeName && prog.name === input.programmeName) continue;
    const res = findBestFive(studentResults, prog.requirements);
    if (!res.valid) continue;

    if (filledUtme.length >= 3 && prog.utmeReqs) {
      const utmeOk = checkUTMESubjects(input.utmeSubjects, prog.utmeReqs);
      if (!utmeOk.valid) continue;
    }

    const a = analyseProgramme(prog, input, studentResults, res.totalPoints);
    items.push({
      prog,
      olevelPts: res.totalPoints!,
      scored: a.scored,
      neededPostUtme: a.neededPostUtme,
      band: a.band,
      chance: a.chance,
    });
  }

  const grouped: Record<string, AltItem[]> = {};
  for (const it of items) {
    (grouped[it.prog.faculty] ||= []).push(it);
  }

  const chanceOrder: Record<Chance, number> = {
    high: 0,
    med: 1,
    low: 2,
    unknown: 3,
    none: 4,
  };
  for (const fac of Object.keys(grouped)) {
    grouped[fac].sort(
      (a, b) =>
        chanceOrder[a.chance] - chanceOrder[b.chance] ||
        (a.neededPostUtme ?? 99) - (b.neededPostUtme ?? 99),
    );
  }

  const sortedFaculties = Object.keys(grouped).sort((a, b) => {
    const aHigh = grouped[a].filter((r) => r.chance === 'high').length;
    const bHigh = grouped[b].filter((r) => r.chance === 'high').length;
    return bHigh - aHigh || grouped[b].length - grouped[a].length;
  });

  return { grouped, sortedFaculties, total: items.length };
}
