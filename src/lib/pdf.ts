import { jsPDF } from 'jspdf';
import {
  analyseProgramme,
  type Analysis,
  type Band,
  type OlevelEntry,
  type StudentInput,
} from './scoring';
import type { AltItem } from './scoring';

const facShort = (f: string) => f.replace('Faculty of ', '').replace('College of ', '');

const BAND_PDF: Record<Band, { label: string; rgb: [number, number, number] }> = {
  admitted: { label: "You're in", rgb: [5, 150, 105] },
  close: { label: 'On the border', rgb: [217, 119, 6] },
  below: { label: 'Below cut-off', rgb: [234, 88, 12] },
  far: { label: 'Well below', rgb: [220, 38, 38] },
  unknown: { label: 'Confirm cut-off', rgb: [100, 116, 139] },
};

// Rotating card accent (matches lib/ui COURSE_PALETTE hues, as RGB) — the
// coloured "tip" of each course card in the faculty PDF.
const COURSE_PDF: [number, number, number][] = [
  [139, 92, 246], // violet
  [16, 185, 129], // emerald
  [14, 165, 233], // sky
  [244, 63, 94], // rose
  [245, 158, 11], // amber
  [99, 102, 241], // indigo
  [20, 184, 166], // teal
  [217, 70, 239], // fuchsia
  [249, 115, 22], // orange
  [6, 182, 212], // cyan
];

// ── One-page admission assessment report ──────────────────────────────────
export function generatePDF(
  name: string,
  input: StudentInput,
  studentResults: OlevelEntry[],
  a: Analysis,
) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const prog = a.prog;

  const utme = parseFloat(input.utmeScore) || 0;
  const utmeContrib = a.utmeContrib;
  const olevelContrib = a.olevelPts;
  const postUtmeContrib = a.postUtmeContrib;
  const aggregate = a.aggregate;
  const merit = a.merit;
  const catchmentScore = a.catchmentScore;
  const cutoff = a.primaryCut ?? merit;
  const margin = a.margin ?? 0;
  const subjectIneligible = !a.utmeOk || !a.olevelOk;

  const W = 210; // A4 width mm
  let y = 0;

  const teal: [number, number, number] = [13, 148, 136];

  // ── Header banner ──
  doc.setFillColor(...teal);
  doc.rect(0, 0, W, 28, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Ciceroo', 14, 11);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('UNILAG 2025/2026 Admission Intelligence by Skujy Tutorials', 14, 17);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('ADMISSION ASSESSMENT REPORT', 14, 24);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  const today = new Date().toLocaleDateString('en-NG', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  doc.text(`Generated: ${today}`, W - 14, 24, { align: 'right' });
  y = 36;

  // ── Student info ──
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text(name || 'Student', 14, y);
  y += 6;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Course: ${prog.name}  |  Faculty: ${prog.faculty}`, 14, y);
  y += 4;
  doc.text(`State of Origin: ${input.stateOfOrigin || 'Not specified'}`, 14, y);
  y += 8;

  const divider = () => {
    doc.setDrawColor(226, 232, 240);
    doc.line(14, y, W - 14, y);
    y += 6;
  };
  const heading = (label: string) => {
    doc.setTextColor(...teal);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text(label, 14, y);
    y += 5;
  };

  doc.setDrawColor(226, 232, 240);
  doc.line(14, y, W - 14, y);
  y += 7;

  // ── Score breakdown ──
  heading('SCORE BREAKDOWN');
  const filledOlevel = studentResults.filter((r) => r.subject && r.grade);
  const rows: [string, string, string][] = [
    ['UTME Score', `${utme} / 400`, `Contribution: ${utmeContrib.toFixed(2)} / 50`],
    ['O/Level Best 5', `${olevelContrib.toFixed(2)} / 20`, `Based on ${Math.min(filledOlevel.length, 5)} subjects`],
    ['Post-UTME Score', `${postUtmeContrib.toFixed(2)} / 30`, ''],
    ['Aggregate', `${aggregate.toFixed(2)} / 100`, ''],
  ];
  doc.setFontSize(8.5);
  for (const [label, val, note] of rows) {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    doc.text(label, 14, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...teal);
    doc.text(val, 120, y, { align: 'right' });
    if (note) {
      doc.setTextColor(148, 163, 184);
      doc.setFontSize(7);
      doc.text(note, 125, y);
      doc.setFontSize(8.5);
    }
    y += 6;
  }
  y += 2;

  // ── Cut-off analysis ──
  divider();
  heading('CUT-OFF ANALYSIS');
  doc.setFontSize(8.5);
  const cutoffRows: [string, string][] = [
    ['Merit Cut-off (2024/25)', merit > 0 ? `${merit}` : 'No data'],
  ];
  if (catchmentScore !== null)
    cutoffRows.push([`${input.stateOfOrigin} Catchment Cut-off`, `${catchmentScore}`]);
  cutoffRows.push(['Effective Cut-off Applied', cutoff > 0 ? `${cutoff} / 100` : 'No data']);
  cutoffRows.push(['Your Aggregate', `${aggregate.toFixed(2)} / 100`]);
  cutoffRows.push([
    'Margin vs Cut-off',
    merit > 0 ? `${margin >= 0 ? '+' : ''}${margin.toFixed(2)}` : 'N/A',
  ]);
  for (const [label, val] of cutoffRows) {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    doc.text(label, 14, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(val, 120, y, { align: 'right' });
    y += 6;
  }
  y += 2;

  // ── UTME subjects ──
  divider();
  heading('UTME SUBJECTS');
  doc.setFontSize(8.5);
  input.utmeSubjects
    .filter((s) => s)
    .forEach((s, i) => {
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(30, 41, 59);
      doc.text(`${i + 1}. ${s}`, 14, y);
      y += 5;
    });
  y += 2;

  // ── O/Level results (two columns) ──
  divider();
  heading('O/LEVEL RESULTS');
  doc.setFontSize(8.5);
  for (let i = 0; i < filledOlevel.length; i += 2) {
    const first = filledOlevel[i];
    const second = filledOlevel[i + 1];
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 41, 59);
    doc.text(`${first.subject}: ${first.grade}`, 14, y);
    if (second) doc.text(`${second.subject}: ${second.grade}`, 110, y);
    y += 5;
  }
  y += 2;

  // ── Verdict ──
  divider();
  let verdictText: string;
  let verdictColor: [number, number, number];
  if (subjectIneligible) {
    verdictText = 'WRONG SUBJECT COMBINATION';
    verdictColor = [220, 38, 38];
  } else if (merit <= 0) {
    verdictText = `AGGREGATE ${aggregate.toFixed(1)} / 100  |  NO CUT-OFF ON RECORD`;
    verdictColor = [100, 116, 139];
  } else if (a.admitted) {
    verdictText = `ADMITTED  |  ${aggregate.toFixed(1)} vs ${cutoff} (+${margin.toFixed(1)})`;
    verdictColor = [5, 150, 105];
  } else {
    verdictText = `BELOW CUT-OFF  |  ${aggregate.toFixed(1)} vs ${cutoff} (${margin.toFixed(1)})`;
    verdictColor = margin >= -3 ? [217, 119, 6] : [220, 38, 38];
  }
  doc.setFillColor(...verdictColor);
  doc.roundedRect(14, y, W - 28, 12, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(verdictText, W / 2, y + 7.5, { align: 'center' });

  // ── Contact footer ──
  doc.setFillColor(241, 245, 249);
  doc.rect(0, 260, W, 37, 'F');
  doc.setTextColor(...teal);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Need guidance? Contact Skujy Tutorials', W / 2, 268, { align: 'center' });
  doc.setTextColor(71, 85, 105);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Phone: 09069882502', W / 2, 274, { align: 'center' });
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text(
    'This report is generated by Ciceroo  |  UNILAG Admission Intelligence by Skujy Tutorials.',
    W / 2,
    280,
    { align: 'center' },
  );
  doc.text(
    'Cut-off data is based on 2024/2025 figures. Always verify at unilag.edu.ng.',
    W / 2,
    285,
    { align: 'center' },
  );

  const filename = `Ciceroo_${(name || 'Student').replace(/\s+/g, '_')}_${prog.name.replace(
    /\s+/g,
    '_',
  )}.pdf`;
  doc.save(filename);
}

// ── Per-faculty report: qualifying courses ranked by strength ─────────────
export function generateFacultyPDF(
  name: string,
  input: StudentInput,
  studentResults: OlevelEntry[],
  faculty: string,
  items: AltItem[],
) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W = 210;
  const teal: [number, number, number] = [13, 148, 136];
  const short = facShort(faculty);

  const today = new Date().toLocaleDateString('en-NG', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  // ── Header banner ──
  const drawHeader = () => {
    doc.setFillColor(...teal);
    doc.rect(0, 0, W, 34, 'F');

    // logo mark
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(14, 9.5, 12, 12, 2.6, 2.6, 'F');
    doc.setTextColor(...teal);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    doc.text('C', 20, 18.4, { align: 'center' });

    // wordmark + tagline
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(19);
    doc.text('Ciceroo', 30, 16.4);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(210, 244, 239);
    doc.setCharSpace(1.1);
    doc.text('ADMISSION INTELLIGENCE', 30.6, 22);
    doc.setCharSpace(0);

    // faculty pill (right)
    const tag = `${short.toUpperCase()} FACULTY`;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    const pillW = doc.getTextWidth(tag) + 8;
    const pillX = W - 14 - pillW;
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(pillX, 9.5, pillW, 7.5, 3.75, 3.75, 'F');
    doc.setTextColor(...teal);
    doc.text(tag, pillX + pillW / 2, 14.6, { align: 'center' });

    // date
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(210, 244, 239);
    doc.text(`Generated ${today}`, W - 14, 24, { align: 'right' });
  };

  drawHeader();

  // ── Student name row ──
  const utme = parseFloat(input.utmeScore) || 0;
  const utmeContrib = Math.min(utme / 8, 50);
  const postUtmeContrib = Math.max(0, Math.min(parseFloat(input.postUtme) || 0, 30));
  // The WAEC results and UTME/Post-UTME scores are the same for every course.
  // What differs course-to-course is which 5 subjects each one *counts* (its
  // required combination) — so the O/Level points, and therefore the
  // aggregate, are shown per course on the cards below, not once here.
  const waec = studentResults.filter((r) => r.subject && r.grade);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(...teal);
  doc.text('STUDENT', 14, 43);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(17, 24, 39);
  doc.text(name || 'Student', 14, 50.5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(
    `UTME ${utme} / 400    |    ${input.stateOfOrigin || 'State not set'}`,
    W - 14,
    49,
    { align: 'right' },
  );

  // ── WAEC results + exam scores cards (side by side, teal-tipped) ──
  const miniCard = (x: number, w: number) => {
    doc.setFillColor(...teal);
    doc.roundedRect(x, 55, w, 34, 2.6, 2.6, 'F');
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(228, 233, 239);
    doc.setLineWidth(0.3);
    doc.roundedRect(x, 57.5, w, 31.5, 2.6, 2.6, 'FD');
  };
  miniCard(12, 112);
  miniCard(130, 68);

  // WAEC results (all subjects entered) — left card
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(...teal);
  doc.text('YOUR WAEC RESULTS', 18, 64);
  if (waec.length === 0) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(148, 163, 184);
    doc.text('No O/Level subjects on record.', 18, 72);
  }
  waec.slice(0, 9).forEach((r, k) => {
    const col = k % 3;
    const row = Math.floor(k / 3);
    const cx = 18 + col * 35;
    const cyk = 70 + row * 6;
    const sub = (doc.splitTextToSize(r.subject, 26) as string[])[0];
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(51, 65, 85);
    doc.text(sub, cx, cyk);
    const wsub = doc.getTextWidth(sub);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...teal);
    doc.text(` ${r.grade}`, cx + wsub, cyk);
  });

  // Exam scores (fixed across all courses) — right card
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(...teal);
  doc.text('YOUR EXAM SCORES', 136, 64);
  const scoreRow = (label: string, val: string, yy: number) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    doc.text(label, 136, yy);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    doc.text(val, 192, yy, { align: 'right' });
  };
  scoreRow('UTME', `${utmeContrib.toFixed(1)} / 50`, 71);
  scoreRow('Post-UTME', `${postUtmeContrib.toFixed(1)} / 30`, 77.5);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  doc.text('+ O/Level (best 5) differs by course', 136, 85);

  // ── Faculty title ──
  let y = 98;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(17, 24, 39);
  doc.text(short, 14, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(120, 130, 145);
  doc.text(
    `${items.length} course${items.length !== 1 ? 's' : ''} you qualify for, ranked strongest first.`,
    14,
    y,
  );
  y += 9;

  // ── Course cards (2-up grid, coloured tip like the on-screen cards) ──
  const marginX = 12;
  const cardW = 91;
  const cardH = 47;
  const gapX = 6;
  const gapY = 6;
  const colX = [marginX, marginX + cardW + gapX];

  const drawCard = (x: number, cy: number, it: AltItem, i: number) => {
    const accent = COURSE_PDF[i % COURSE_PDF.length];
    const bandInfo = BAND_PDF[it.band];
    const a: Analysis = analyseProgramme(it.prog, input, studentResults);
    const bigNum = it.aggregate.toFixed(1);
    const cut = a.primaryCut !== null ? `${a.primaryCut}` : a.merit > 0 ? `${a.merit}` : '-';

    // accent card behind → coloured tip; white body over it leaves a strip
    doc.setFillColor(...accent);
    doc.roundedRect(x, cy, cardW, cardH, 3.2, 3.2, 'F');
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(232, 236, 242);
    doc.setLineWidth(0.2);
    doc.roundedRect(x, cy + 4.5, cardW, cardH - 4.5, 3.2, 3.2, 'FD');

    const px = x + 8; // left padding
    const pr = x + cardW - 8; // right edge

    // rank + chance row
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(160, 170, 185);
    doc.text(`#${i + 1}`, px, cy + 14);
    doc.setFontSize(7.5);
    doc.setTextColor(...accent);
    doc.text(bandInfo.label.toUpperCase(), pr, cy + 14, { align: 'right' });

    // course name (up to 2 lines)
    doc.setTextColor(17, 24, 39);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    const nameLines = (doc.splitTextToSize(it.prog.name, cardW - 16) as string[]).slice(0, 2);
    doc.text(nameLines[0], px, cy + 22);
    if (nameLines[1]) doc.text(nameLines[1], px, cy + 27.5);

    // per-course O/Level — makes clear each course counts a different best-5
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Counts your best 5 for this course: O/Level ${it.olevelPts.toFixed(1)} / 20`,
      px,
      cy + 32.5,
    );

    // aggregate headline
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(148, 163, 184);
    doc.text('YOUR AGGREGATE', px, cy + 37);
    doc.setFontSize(19);
    doc.setTextColor(...accent);
    doc.text(bigNum, px, cy + 44.5);
    const nw = doc.getTextWidth(bigNum);
    doc.setFontSize(9);
    doc.setTextColor(160, 170, 185);
    doc.text('/ 100', px + nw + 1.6, cy + 44.5);

    // cut-off, bottom-right
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text('CUT-OFF', pr, cy + 40, { align: 'right' });
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(51, 65, 85);
    doc.text(cut, pr, cy + 45, { align: 'right' });
  };

  items.forEach((it, i) => {
    const col = i % 2;
    if (col === 0) {
      if (i > 0) y += cardH + gapY;
      if (y + cardH > 266) {
        doc.addPage();
        drawHeader();
        y = 40;
      }
    }
    drawCard(colX[col], y, it, i);
  });

  const filename = `Ciceroo_${(name || 'Student').replace(/\s+/g, '_')}_${short.replace(
    /\s+/g,
    '_',
  )}_courses.pdf`;
  doc.save(filename);
}

// ── Merged report: every faculty the student qualifies for, one document ──
export function generateFullReportPDF(
  name: string,
  input: StudentInput,
  studentResults: OlevelEntry[],
  grouped: Record<string, AltItem[]>,
  sortedFaculties: string[],
) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W = 210;
  const teal: [number, number, number] = [13, 148, 136];
  const today = new Date().toLocaleDateString('en-NG', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  const utme = parseFloat(input.utmeScore) || 0;
  const utmeContrib = Math.min(utme / 8, 50);
  const postUtmeContrib = Math.max(0, Math.min(parseFloat(input.postUtme) || 0, 30));
  const totalCourses = sortedFaculties.reduce((s, f) => s + grouped[f].length, 0);

  // Format a requirement group list into readable text.
  const fmt = (groups: { subjects: string[]; count: number; label?: string }[]) =>
    groups
      .map((g) => {
        if (g.subjects.includes('__ANY__'))
          return g.label
            ? `${g.count} of ${g.label}`
            : `${g.count} free elective${g.count > 1 ? 's' : ''}`;
        if (g.count >= g.subjects.length) return g.subjects.join(' + ');
        const list = g.subjects.slice(0, 6).join(' / ');
        const more = g.subjects.length > 6 ? ` +${g.subjects.length - 6}` : '';
        return `${g.count} of (${list}${more})`;
      })
      .join(', ');

  const drawHeader = () => {
    doc.setFillColor(...teal);
    doc.rect(0, 0, W, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text('Ciceroo', 14, 14);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(210, 244, 239);
    doc.text('UNILAG 2025/2026 Admission Intelligence  |  by Skujy Tutorials', 14, 20);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text('FULL ADMISSION REPORT', W - 14, 14, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(210, 244, 239);
    doc.text(`Generated ${today}`, W - 14, 20, { align: 'right' });
  };

  drawHeader();

  // Student summary
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(...teal);
  doc.text('STUDENT', 14, 40);
  doc.setFontSize(16);
  doc.setTextColor(17, 24, 39);
  doc.text(name || 'Student', 14, 47.5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text(
    `UTME ${utme}/400 (${utmeContrib.toFixed(1)}/50)  |  Post-UTME ${postUtmeContrib.toFixed(1)}/30  |  ${input.stateOfOrigin || 'State not set'}`,
    W - 14,
    47.5,
    { align: 'right' },
  );
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(17, 24, 39);
  doc.text(
    `${totalCourses} course${totalCourses !== 1 ? 's' : ''} you qualify for, across ${sortedFaculties.length} facult${sortedFaculties.length !== 1 ? 'ies' : 'y'}`,
    14,
    56,
  );

  let y = 64;
  const bottom = 285;

  sortedFaculties.forEach((fac, fi) => {
    const items = grouped[fac];
    const accent = COURSE_PDF[fi % COURSE_PDF.length];
    // space for section header + at least one row
    if (y + 22 > bottom) {
      doc.addPage();
      drawHeader();
      y = 40;
    }

    // faculty section header
    doc.setFillColor(...accent);
    doc.roundedRect(12, y, W - 24, 9, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(facShort(fac).toUpperCase(), 16, y + 6.2);
    doc.setFontSize(8);
    const inCount = items.filter((it) => it.admitted).length;
    doc.text(
      `${items.length} course${items.length !== 1 ? 's' : ''}  ·  ${inCount} you're in`,
      W - 16,
      y + 6.2,
      { align: 'right' },
    );
    y += 13;

    items.forEach((it, i) => {
      if (y + 12 > bottom) {
        doc.addPage();
        drawHeader();
        y = 40;
      }
      const a = analyseProgramme(it.prog, input, studentResults);
      const band = BAND_PDF[it.band];
      const cut = a.primaryCut !== null ? `${a.primaryCut}` : '-';

      // rank + course name
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(17, 24, 39);
      const nm = (doc.splitTextToSize(`${i + 1}. ${it.prog.name}`, 120) as string[])[0];
      doc.text(nm, 16, y);

      // aggregate / cut-off / verdict (right)
      doc.setFontSize(9);
      doc.setTextColor(...accent);
      doc.text(`${it.aggregate.toFixed(1)}/100`, 150, y, { align: 'right' });
      doc.setTextColor(120, 130, 145);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.text(`cut ${cut}`, 168, y, { align: 'right' });
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(...band.rgb);
      doc.text(band.label.toUpperCase(), W - 16, y, { align: 'right' });

      // requirement sub-lines
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(120, 130, 145);
      const utmeLine = (doc.splitTextToSize(`UTME: ${fmt(it.prog.utmeReqs)}`, W - 34) as string[])[0];
      doc.text(utmeLine, 20, y + 4);
      const olLine = (doc.splitTextToSize(`O/Level: ${fmt(it.prog.requirements)}`, W - 34) as string[])[0];
      doc.text(olLine, 20, y + 7.6);

      y += 11;
      doc.setDrawColor(241, 245, 249);
      doc.line(16, y - 1.5, W - 16, y - 1.5);
    });
    y += 4;
  });

  // footer note on last page
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text(
    'Ciceroo  |  UNILAG Admission Intelligence by Skujy Tutorials  ·  Cut-offs from 2024/2025; verify at unilag.edu.ng  ·  Call 09069882502',
    W / 2,
    292,
    { align: 'center' },
  );

  const filename = `Ciceroo_${(name || 'Student').replace(/\s+/g, '_')}_Full_Report.pdf`;
  doc.save(filename);
}
