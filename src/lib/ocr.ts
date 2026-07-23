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
      const n = parseInt(m[1], 10);
      if (n >= 100 && n <= 400) {
        score = n;
        break;
      }
    }
  }

  // Subject + per-subject score lines: "Mathematics 78"
  const subjectScorePattern = /([A-Za-z][A-Za-z\s/\-&]{3,30}?)\s+(\d{1,2})\b/g;
  const knownSubjects = SUBJECTS.map((s) => s.toLowerCase());
  const found: string[] = [];
  let m2: RegExpExecArray | null;
  while ((m2 = subjectScorePattern.exec(text)) !== null) {
    const nameLower = m2[1].trim().toLowerCase();
    const match = knownSubjects.find(
      (s) =>
        s.includes(nameLower.substring(0, 5)) ||
        nameLower.includes(s.substring(0, 5)),
    );
    if (match && parseInt(m2[2], 10) <= 100) {
      const canonical = SUBJECTS.find((s) => s.toLowerCase() === match);
      if (canonical && !found.includes(canonical)) found.push(canonical);
    }
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
  C4: 'C4',
  C5: 'C5',
  C6: 'C6',
  D7: 'D7',
  E8: 'E8',
  F9: 'F9',
};

export function parseOLevelResult(text: string): OlevelExtract[] {
  const knownSubjects = SUBJECTS.map((s) => s.toLowerCase());
  const results: OlevelExtract[] = [];

  for (const line of text.split('\n')) {
    // "MATHEMATICS A1" / "English Language B2"
    const m = line.match(
      /([A-Za-z][A-Za-z\s/\-&]{3,35}?)\s+(A1|A2|B2|B3|C4|C5|C6|D7|E8|F9)\b/i,
    );
    if (!m) continue;
    const nameLower = m[1].trim().toLowerCase();
    const grade = GRADE_MAP[m[2].toUpperCase()];
    const match = knownSubjects.find(
      (s) =>
        s.includes(nameLower.substring(0, 6)) ||
        nameLower.includes(s.substring(0, 6)),
    );
    const canonical = match ? SUBJECTS.find((s) => s.toLowerCase() === match) : null;
    if (canonical && grade && !results.some((r) => r.subject === canonical)) {
      results.push({ subject: canonical, grade });
    }
  }
  return results;
}
