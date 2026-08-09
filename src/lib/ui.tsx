import {
  Stethoscope,
  Pill,
  Cog,
  FlaskConical,
  TrendingUp,
  Scale,
  Palette,
  Globe2,
  Trees,
  GraduationCap,
  BookOpen,
  type LucideIcon,
} from 'lucide-react';
import type { Band, Chance } from './scoring';

export const FACULTY_META: Record<
  string,
  { icon: LucideIcon; grad: string; tint: string; text: string }
> = {
  'College of Medicine': { icon: Stethoscope, grad: 'from-teal-500 to-cyan-500', tint: 'bg-teal-50', text: 'text-teal-700' },
  'Faculty of Pharmacy': { icon: Pill, grad: 'from-emerald-500 to-teal-500', tint: 'bg-emerald-50', text: 'text-emerald-700' },
  'Faculty of Engineering': { icon: Cog, grad: 'from-blue-600 to-indigo-500', tint: 'bg-blue-50', text: 'text-blue-700' },
  'Faculty of Science': { icon: FlaskConical, grad: 'from-violet-500 to-purple-500', tint: 'bg-violet-50', text: 'text-violet-700' },
  'Faculty of Management Sciences': { icon: TrendingUp, grad: 'from-amber-500 to-orange-500', tint: 'bg-amber-50', text: 'text-amber-700' },
  'Faculty of Law': { icon: Scale, grad: 'from-rose-500 to-red-500', tint: 'bg-rose-50', text: 'text-rose-700' },
  'Faculty of Arts': { icon: Palette, grad: 'from-pink-500 to-rose-500', tint: 'bg-pink-50', text: 'text-pink-700' },
  'Faculty of Social Sciences': { icon: Globe2, grad: 'from-cyan-500 to-sky-500', tint: 'bg-cyan-50', text: 'text-cyan-700' },
  'Faculty of Environmental Sciences': { icon: Trees, grad: 'from-lime-500 to-green-500', tint: 'bg-lime-50', text: 'text-lime-700' },
  'Faculty of Education': { icon: GraduationCap, grad: 'from-purple-500 to-fuchsia-500', tint: 'bg-purple-50', text: 'text-purple-700' },
};

export function facultyMeta(faculty: string) {
  return (
    FACULTY_META[faculty] || {
      icon: BookOpen,
      grad: 'from-slate-500 to-slate-600',
      tint: 'bg-slate-50',
      text: 'text-slate-700',
    }
  );
}

export function facultyShort(faculty: string) {
  return faculty.replace('Faculty of ', '').replace('College of ', '');
}

export interface BandStyle {
  label: string;
  grad: string; // gradient for the hero / icon chip
  chip: string; // small badge bg+text
  text: string; // accent text colour
  ring: string; // soft border
  shadow: string; // coloured shadow
  blob: string; // ambient blob colour
}

export const BAND_STYLE: Record<Band, BandStyle> = {
  admitted: {
    label: "You're in",
    grad: 'from-emerald-500 to-teal-500',
    chip: 'bg-emerald-50 text-emerald-700',
    text: 'text-emerald-600',
    ring: 'border-emerald-100',
    shadow: 'shadow-emerald-500/30',
    blob: 'bg-emerald-400/20',
  },
  close: {
    label: 'On the border',
    grad: 'from-amber-500 to-orange-500',
    chip: 'bg-amber-50 text-amber-700',
    text: 'text-amber-600',
    ring: 'border-amber-100',
    shadow: 'shadow-amber-500/30',
    blob: 'bg-amber-400/20',
  },
  below: {
    label: 'Below cut-off',
    grad: 'from-orange-500 to-rose-500',
    chip: 'bg-orange-50 text-orange-700',
    text: 'text-orange-600',
    ring: 'border-orange-100',
    shadow: 'shadow-orange-500/30',
    blob: 'bg-orange-400/20',
  },
  far: {
    label: 'Well below',
    grad: 'from-rose-500 to-red-500',
    chip: 'bg-rose-50 text-rose-700',
    text: 'text-rose-600',
    ring: 'border-rose-100',
    shadow: 'shadow-rose-500/30',
    blob: 'bg-rose-400/20',
  },
  unknown: {
    label: 'Confirm cut-off',
    grad: 'from-slate-500 to-slate-600',
    chip: 'bg-slate-100 text-slate-600',
    text: 'text-slate-600',
    ring: 'border-slate-200',
    shadow: 'shadow-slate-500/20',
    blob: 'bg-slate-400/10',
  },
};

// ── Rotating palette: white card + coloured accents (top bar, tinted chip,
//    faded watermark) so every card gets its own colour. Distinct hues. ────
export interface CoursePaint {
  bar: string; // slim gradient strip across the top
  tintBg: string; // soft icon-chip background
  tintText: string; // icon + accent text colour
  wash: string; // faded decorative circle
  mark: string; // large faded watermark icon colour
}

export const COURSE_PALETTE: CoursePaint[] = [
  { bar: 'from-violet-400 to-fuchsia-500', tintBg: 'bg-violet-50', tintText: 'text-violet-600', wash: 'bg-violet-100', mark: 'text-violet-100' },
  { bar: 'from-emerald-400 to-green-500', tintBg: 'bg-emerald-50', tintText: 'text-emerald-600', wash: 'bg-emerald-100', mark: 'text-emerald-100' },
  { bar: 'from-sky-400 to-blue-500', tintBg: 'bg-sky-50', tintText: 'text-sky-600', wash: 'bg-sky-100', mark: 'text-sky-100' },
  { bar: 'from-rose-400 to-pink-500', tintBg: 'bg-rose-50', tintText: 'text-rose-600', wash: 'bg-rose-100', mark: 'text-rose-100' },
  { bar: 'from-amber-400 to-orange-500', tintBg: 'bg-amber-50', tintText: 'text-amber-600', wash: 'bg-amber-100', mark: 'text-amber-100' },
  { bar: 'from-indigo-400 to-violet-500', tintBg: 'bg-indigo-50', tintText: 'text-indigo-600', wash: 'bg-indigo-100', mark: 'text-indigo-100' },
  { bar: 'from-teal-400 to-cyan-500', tintBg: 'bg-teal-50', tintText: 'text-teal-600', wash: 'bg-teal-100', mark: 'text-teal-100' },
  { bar: 'from-fuchsia-400 to-pink-500', tintBg: 'bg-fuchsia-50', tintText: 'text-fuchsia-600', wash: 'bg-fuchsia-100', mark: 'text-fuchsia-100' },
  { bar: 'from-orange-400 to-red-500', tintBg: 'bg-orange-50', tintText: 'text-orange-600', wash: 'bg-orange-100', mark: 'text-orange-100' },
  { bar: 'from-cyan-400 to-sky-500', tintBg: 'bg-cyan-50', tintText: 'text-cyan-600', wash: 'bg-cyan-100', mark: 'text-cyan-100' },
];

export function coursePaint(i: number): CoursePaint {
  return COURSE_PALETTE[i % COURSE_PALETTE.length];
}

export const CHANCE_STYLE: Record<Chance, { label: string; chip: string; dot: string }> = {
  high: { label: 'Admitted', chip: 'bg-emerald-50 text-emerald-700 ring-emerald-100', dot: 'bg-emerald-400' },
  med: { label: 'Borderline', chip: 'bg-amber-50 text-amber-700 ring-amber-100', dot: 'bg-amber-400' },
  low: { label: 'Below', chip: 'bg-orange-50 text-orange-700 ring-orange-100', dot: 'bg-orange-400' },
  none: { label: 'Well below', chip: 'bg-rose-50 text-rose-700 ring-rose-100', dot: 'bg-rose-400' },
  unknown: { label: 'No data', chip: 'bg-slate-100 text-slate-600 ring-slate-200', dot: 'bg-slate-400' },
};
