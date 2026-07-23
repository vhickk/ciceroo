import { jsPDF } from 'jspdf';
import type { Analysis, OlevelEntry, StudentInput } from './scoring';

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
  const scored = a.scored;
  const merit = a.merit;
  const catchmentScore = a.catchmentScore;
  const cutoff = a.primaryCut ?? merit;
  const neededPostUtme = a.neededPostUtme ?? 0;
  const subjectIneligible = !a.utmeOk || !a.olevelOk;
  const scoresTooLow = !subjectIneligible && a.band === 'unreachable';

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
    ['UTME + O/Level Combined', `${scored.toFixed(2)} / 70`, ''],
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
  cutoffRows.push(['Effective Cut-off Applied', cutoff > 0 ? `${cutoff}` : 'No data']);
  cutoffRows.push([
    'Required Post-UTME Score',
    merit > 0 && !subjectIneligible ? `${Math.max(neededPostUtme, 0).toFixed(2)} / 30` : 'N/A',
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
  } else if (scoresTooLow) {
    verdictText = 'SCORES TOO LOW';
    verdictColor = [220, 38, 38];
  } else if (neededPostUtme <= 0) {
    verdictText = 'ALREADY BEATS CUT-OFF';
    verdictColor = [5, 150, 105];
  } else {
    verdictText = `NEEDS ${neededPostUtme.toFixed(1)}/30 IN POST-UTME`;
    verdictColor = neededPostUtme <= 22 ? [5, 150, 105] : [217, 119, 6];
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
    'This report is generated by Ciceroo — UNILAG Admission Intelligence by Skujy Tutorials.',
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
