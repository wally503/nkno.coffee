// src/constants/gridStyles.js

export const REQUIRED_EMPTY_NUDGE_SX = {
  '& .MuiOutlinedInput-root': {
    // backgroundColor: 'rgba(230, 190, 30, 0.12)',
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.6)',
      borderWidth: '2px',
    },
  },
};

export const OPTIONAL_EMPTY_NUDGE_SX = {
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'rgba(134, 96, 31, 0.74)',
      borderWidth: '2px',
    },
  },
};

export function requiredNudgeStyling(item, mode, value, error) {
  const isEmpty = value === undefined || value === null || value === "";
  if (mode === "view" || error) return {};
  if (isEmpty && item.required) return REQUIRED_EMPTY_NUDGE_SX;
  if (isEmpty && !item.required) return OPTIONAL_EMPTY_NUDGE_SX;
  return {};
}

export function trimDurationDisplay(value) {
  if (!value) return value;
  // strips a leading "00:" (or any leading two-digit group + colon) — HH prefix
  return value.replace(/^\d{2}:/, '');
}