import { createWorker } from 'tesseract.js';
import { SUBJECTS } from '../data/programmes';

// ── Run Tesseract OCR client-side (no AI, no server) ──────────────────────
export async function runOCR(
  file: File,
  onProgress?: (pct: number) => void,
): Promise<string> {
  const worker = await createWorker('eng', 1, {
    logger: (m: { status: string; progress: number }) => {
      if (m.status === 'recognizing text' && onProgress) {
        onProgress(Math.round(m.progress * 100));
      }
    },
  });
  const {
    data: { text },
  } = await worker.recognize(file);
  await worker.terminate();
  return text;
}

// ── Subject recognition: aliases, abbreviations + fuzzy matching ──────────
// Common ways each subject shows up on JAMB/WAEC slips, hand-written notes,
// and OCR mis-reads. Keys are the canonical names in SUBJECTS.
const SUBJECT_ALIASES: Record<string, string[]> = {
  'English Language': ['english', 'eng', 'eng lang', 'english lang', 'use of english', 'gen english'],
  Mathematics: ['maths', 'math', 'mth', 'gen maths', 'general mathematics', 'elem maths'],
  'Further Mathematics': ['further maths', 'further math', 'f maths', 'f-maths', 'add maths', 'additional mathematics', 'add math'],
  Biology: ['bio'],
  Chemistry: ['chem'],
  Physics: ['phy', 'phys'],
  'Agricultural Science': ['agric', 'agriculture', 'agric science', 'agric sci', 'agriculture science'],
  'Health Science': ['health sci'],
  'Health Education': ['health ed', 'health edu'],
  Geography: ['geo', 'geog'],
  Economics: ['econs', 'econ', 'eco', 'economic'],
  Government: ['govt', 'gov', 'goverment'],
  History: ['hist'],
  'Literature-in-English': ['literature', 'lit', 'lit in english', 'lit-in-english', 'literature in english', 'english literature', 'lit english'],
  'Christian Religious Studies': ['crs', 'crk', 'christian religious', 'christian rel studies', 'christian religious knowledge', 'chr rel studies'],
  'Islamic Religious Studies': ['irs', 'irk', 'islamic religious', 'islamic studies', 'islamic religious knowledge'],
  Yoruba: [],
  Igbo: ['ibo'],
  Hausa: [],
  French: ['fr'],
  'Fine Arts': ['fine art'],
  'Visual Arts': ['visual art', 'creative art', 'creative arts'],
  Music: [],
  'Technical Drawing': ['tech drawing', 'technical draw', 'ted'],
  'Computer Studies': ['computer', 'computer science', 'comp studies', 'computer std', 'ict', 'data processing computer'],
  'Financial Accounting': ['accounting', 'accounts', 'financial account', 'principles of accounts', 'f accounting'],
  Commerce: ['comm'],
  'Civic Education': ['civic', 'civic ed', 'civics'],
  'Social Studies': ['social study', 'soc studies'],
  'Food & Nutrition': ['food and nutrition', 'food nutrition', 'foods and nutrition'],
  'Home Economics': ['home econs', 'home eco', 'home economic'],
  'Clothing & Textile': ['clothing and textile', 'clothing textile', 'clothing and textiles'],
  'Building Construction': ['building', 'building construct'],
  'Book Keeping': ['bookkeeping', 'book-keeping'],
  Insurance: [],
  'Physical Education': ['physical edu', 'phy education', 'pe'],
  'Integrated Science': ['int science', 'integrated sci', 'basic science'],
  'Data Processing': ['data proc', 'data process-ing'],
  'Business Management': ['business mgmt', 'business man', 'business'],
  Arabic: [],
};

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

// canonical/alias (normalised) → canonical subject name
const LOOKUP = new Map<string, string>();
for (const subject of SUBJECTS) LOOKUP.set(norm(subject), subject);
for (const [canonical, aliases] of Object.entries(SUBJECT_ALIASES)) {
  for (const a of aliases) LOOKUP.set(norm(a), canonical);
}

// Levenshtein distance (small strings only)
function lev(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (!m) return n;
  if (!n) return m;
  const dp = Array.from({ length: m + 1 }, (_, i) => i);
  for (let j = 1; j <= n; j++) {
    let prev = dp[0];
    dp[0] = j;
    for (let i = 1; i <= m; i++) {
      const tmp = dp[i];
      dp[i] = Math.min(
        dp[i] + 1,
        dp[i - 1] + 1,
        prev + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
      prev = tmp;
    }
  }
  return dp[m];
}

// Recognise a subject from a raw (possibly noisy / abbreviated) string.
export function matchSubject(raw: string): string | null {
  const n = norm(raw);
  if (n.length < 2) return null;
  if (LOOKUP.has(n)) return LOOKUP.get(n)!;

  let best: string | null = null;
  let bestScore = Infinity; // lower = better
  for (const [key, canonical] of LOOKUP) {
    if (key.length < 4) continue; // short aliases only match exactly (above)
    // containment either way — handles extra words / prefixes on the slip
    if (n.includes(key) || key.includes(n)) {
      const score = Math.abs(key.length - n.length);
      if (score < bestScore) {
        bestScore = score;
        best = canonical;
      }
      continue;
    }
    // fuzzy — tolerate OCR / handwriting slips
    const d = lev(n, key);
    const thresh = key.length <= 5 ? 1 : key.length <= 8 ? 2 : 3;
    if (d <= thresh && d < bestScore) {
      bestScore = d;
      best = canonical;
    }
  }
  return best;
}

// ── Parse a JAMB/UTME result slip ─────────────────────────────────────────
export interface UtmeExtract {
  score: number | null;
  subjects: string[]; // canonical subject names, up to 4
}

export function parseUTMEResult(text: string): UtmeExtract {
  // Total aggregate score (100–400)
  const scorePatterns = [
    /total[:\s]+(\d{2,3})/i,
    /aggregate[:\s]+(\d{2,3})/i,
    /score[:\s]+(\d{2,3})/i,
    /(\d{3})\s*\/\s*400/,
    /\b([2-3]\d{2}|[1-9]\d)\b/, // fallback: plausible 2–3 digit number
  ];
  let score: number | null = null;
  for (const p of scorePatterns) {
    const m = text.match(p);
    if (m) {
      const v = parseInt(m[1], 10);
      if (v >= 100 && v <= 400) {
        score = v;
        break;
      }
    }
  }

  // Subject lines — try each line, stripping any trailing per-subject score.
  const found: string[] = [];
  for (const line of text.split('\n')) {
    if (!line.trim()) continue;
    const cleaned = line.replace(/\b\d{1,3}\b/g, ' '); // drop numbers (scores)
    const subject = matchSubject(cleaned);
    if (subject && !found.includes(subject)) found.push(subject);
  }
  return { score, subjects: found.slice(0, 4) };
}

// ── Parse a WAEC/NECO O/Level result ──────────────────────────────────────
export interface OlevelExtract {
  subject: string;
  grade: string;
}

const GRADE_MAP: Record<string, string> = {
  A1: 'A1',
  A2: 'A1',
  B2: 'B2',
  B3: 'B3',
  B4: 'C4',
  C4: 'C4',
  C5: 'C5',
  C6: 'C6',
  D7: 'D7',
  E8: 'E8',
  F9: 'F9',
};

export function parseOLevelResult(text: string): OlevelExtract[] {
  const results: OlevelExtract[] = [];

  for (const rawLine of text.split('\n')) {
    if (!rawLine.trim()) continue;
    // join a letter split from its digit ("A 1" → "A1") then find the grade
    const line = rawLine.replace(/([A-Fa-f])\s+([1-9])\b/g, '$1$2');
    const gradeMatch = line
      .toUpperCase()
      .match(/\b(A1|A2|B2|B3|B4|C4|C5|C6|D7|E8|F9)\b/);
    if (!gradeMatch) continue;

    const grade = GRADE_MAP[gradeMatch[1]];
    // everything before the grade is the subject candidate
    const idx = line.toUpperCase().indexOf(gradeMatch[1]);
    const subjectPart = line.slice(0, idx).replace(/\b\d{1,3}\b/g, ' ');
    const subject = matchSubject(subjectPart);
    if (subject && grade && !results.some((r) => r.subject === subject)) {
      results.push({ subject, grade });
    }
  }
  return results;
}
