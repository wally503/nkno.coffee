//src/constants/tags.js
export const TAG_PALETTES = {
  default: {
    amazing:      { color: '#9B8AFB', border: '3px double',  glow: false },
    great:        { color: '#307840', border: '3px double', glow: false },
    pro:          { color: '#307840', border: '1px solid',  glow: false },
    other:        { color: '#4269a1', border: '1px solid',  glow: false },
    con:          { color: '#801d1d', border: '1px solid',  glow: false },
    catastrophe:  { color: '#770633', border: '3px double', glow: true  },
  },
  // Lighter versions of the same hues, for the log tables
  table: {
    amazing:      { color: '#B7ABFF', border: '3px double',  glow: false },
    great:        { color: '#5FBF77', border: '3px double', glow: false },
    pro:          { color: '#5FBF77', border: '1px solid',  glow: false },
    other:        { color: '#7B96BD', border: '1px solid',  glow: false },
    con:          { color: '#E06A6A', border: '1px solid',  glow: false },
    catastrophe:  { color: '#E0508A', border: '3px double', glow: true  },
  },
}

// Cluster order: best first, worst last
export const CATEGORY_ORDER = ['amazing', 'great', 'pro', 'other', 'con', 'catastrophe']
export const TAG_STYLES = TAG_PALETTES.default

export const TAG_DENSITY = {
  normal:  { height: 24, fontSize: '0.8125rem', labelPx: 1,    gap: 0.5, textTint: 0    },
  compact: { height: 18, fontSize: '0.68rem',   labelPx: 0.75, gap: 0.4, textTint: 0.35 },
  dense:   { height: 16, fontSize: '0.62rem',   labelPx: 0.6,  gap: 0.3, textTint: 0.35 },
}