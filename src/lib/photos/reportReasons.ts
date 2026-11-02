/**
 * Why a visitor reported a photo — `photo_reports.reason`, a CHECK-constrained
 * column (the backend's `supabase/sql/2026-11-01_photo_reports.sql`). The app
 * offers the same six, worded the same (`PhotoReportReason` in Models.swift).
 * A value missing from the constraint fails the report, so add one there
 * first.
 */
export const REPORT_REASONS = [
  {
    value: 'not_real',
    title: "It isn't a real photo",
    subtitle: 'AI-generated, or not taken by this person.',
  },
  { value: 'sexual', title: 'Nudity or sexual content' },
  { value: 'violent', title: 'Violence or graphic content' },
  { value: 'harassment', title: 'Harassment or hate' },
  {
    value: 'privacy',
    title: 'It invades my privacy',
    subtitle: 'It shows me, or my private information, without my consent.',
  },
  { value: 'other', title: 'Something else' },
] as const satisfies readonly { value: string; title: string; subtitle?: string }[];

export type ReportReason = (typeof REPORT_REASONS)[number]['value'];

export function isReportReason(value: unknown): value is ReportReason {
  return REPORT_REASONS.some((reason) => reason.value === value);
}
