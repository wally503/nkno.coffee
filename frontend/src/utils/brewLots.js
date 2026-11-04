// src/utils/brewLots.js
//
// Shared glue between the brew forms and the lot picker.
// The five brew forms differ in their detail fields but treat the lot identically,
// so the lot-specific logic lives here once.

// Stand-in option value for brews made before lots existed (no lot to show).
export const LEGACY_LOT = "legacy";

// The single option an edit/view form shows for an existing brew: its own lot,
// grouped under its bean. The picker is locked in those modes.
export function lotOptionFromBrew(brewLog) {
  const lot = brewLog?.lot;
  return {
    label: lot ? lot.vessel_label : "Before lot tracking",
    value: lot ? lot.id : LEGACY_LOT,
    group: brewLog?.bean?.name,
    bean: brewLog?.bean?.short_id,
  };
}

// The lot-related keys of the brew_log payload.
//  - bean: from the form on edit, otherwise from the chosen lot's option (add mode)
//  - lot: only a real lot id is sent (a legacy brew has none)
//  - split_lot: the second lot of a split brew, only after the user picked one
//  - correct_remaining: only if the user filled it in
export function brewLogLotFields({ bean, lot, correct_remaining, split_lot }, options) {
  const chosen = options?.lots?.find((option) => option.value === lot);
  const fields = { bean: bean ?? chosen?.bean };
  if (typeof lot === "number") fields.lot = lot;
  if (typeof split_lot === "number") fields.split_lot = split_lot;
  if (correct_remaining !== undefined && correct_remaining !== null && correct_remaining !== "") {
    fields.correct_remaining = correct_remaining;
  }
  return fields;
}

// Helper text under the lot dropdown (add mode only):
//   "100.00 g -> 87.50 g after this brew"
// A correction, if entered, replaces the recorded remaining weight as the baseline.
export function lotDrawHelper(field, formData, mode) {
  if (mode !== "add" || !field.drawHelper) return undefined;
  const chosen = field.options?.find((option) => option.value === formData[field.name]);
  if (!chosen) return undefined;

  const corrected = formData.correct_remaining;
  const hasCorrection = corrected !== undefined && corrected !== null && corrected !== "";
  const baseline = hasCorrection ? Number(corrected) : chosen.remaining;
  if (!Number.isFinite(baseline)) return undefined;

  const dose = Number(formData.weight);
  if (!Number.isFinite(dose) || dose <= 0) return `${baseline.toFixed(2)} g remaining`;

  const after = baseline - Math.round(dose * 100) / 100;
  if (after < 0) {
    return `Only ${baseline.toFixed(2)} g remaining. Use "Lot weight off?" to correct it first.`;
  }
  return `${baseline.toFixed(2)} g → ${after.toFixed(2)} g after this brew`;
}

// Other drawable lots of the same bean as the chosen lot: the choices when a brew
// needs more than the chosen lot holds and is split across two lots.
export function splitCandidates(options, lot) {
  const chosen = options?.lots?.find((option) => option.value === lot);
  if (!chosen) return [];
  return options.lots.filter((option) => option.bean === chosen.bean && option.value !== lot);
}
