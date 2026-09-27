import { TAG_PALETTES, CATEGORY_ORDER } from '../constants/tags'

// ---- category org ---------------------------------------------------------

export const CATEGORY_SECTION = {
  amazing:     'Positive',
  pro:         'Positive',
  great:       'Positive',
  other:       'Neutral',
  con:         'Negative',
  catastrophe: 'Mistakes',
}

const SECTION_ORDER = ['Positive', 'Neutral', 'Negative', 'Mistakes']

export function groupTags(tags) {
  const sorted = sortTags(tags)
  const buckets = new Map()
  for (const t of sorted) {
    const section = CATEGORY_SECTION[t.category] ?? 'Neutral'
    if (!buckets.has(section)) buckets.set(section, { section, tags: [] })
    buckets.get(section).tags.push(t)
  }
  return SECTION_ORDER.map(s => buckets.get(s)).filter(Boolean)
}

// ---- color helpers ---------------------------------------------------------

// Blend a hex color toward black (keep = 1 unchanged, 0.7 = 30% darker)
function shade(hex, keep) {
  const n = parseInt(hex.slice(1, 7), 16)
  const ch = s => Math.round(((n >> s) & 255) * keep).toString(16).padStart(2, '0')
  return `#${ch(16)}${ch(8)}${ch(0)}`
}

function luminance(hex) {
  const n = parseInt(hex.slice(1, 7), 16)
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(v => {
    const c = v / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

const contrast = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)

// ---- tuning ----------------------------------------------------------------

const TEXT_KEEP = 0.15      // text = 15% of the tag color (deep, hue-tinted)
const MIN_CONTRAST = 3.5    // higher = lighter fills, lower = deeper fills

// Darkest fill that still gives readable dark text
function fillFor(color) {
  const textL = luminance(shade(color, TEXT_KEEP))
  for (let keep = 0.7; keep < 1; keep += 0.05) {
    const fill = shade(color, keep)
    if (contrast(luminance(fill), textL) >= MIN_CONTRAST) return fill
  }
  return color
}

// ---- public API ------------------------------------------------------------

// filled: solid fill + dark text.  Otherwise: colored border + colored text.
export function tagSx(tag, { filled = true, glow = filled, textTint = 0, palette = 'default' } = {}) {
  const pal = TAG_PALETTES[palette] ?? TAG_PALETTES.default
  const s = pal[tag.category] ?? pal.other
  const color = tag.color || s.color
  const fill = fillFor(color)
  return {
    color: filled ? shade(color, TEXT_KEEP) : color,
    border: `${s.border} ${color}`,
    backgroundColor: filled ? fill : 'transparent',
    backgroundClip: 'padding-box',   // keeps the gap in double borders see-through
    boxShadow: s.glow && glow ? `0 0 4px ${color}55` : 'none',
    fontWeight: filled ? 600 : 400,
    '&:hover': {
      backgroundColor: filled ? fill : `${color}22`,
      filter: filled ? 'brightness(1.1)' : 'none',
    },
  }
}

export function sortTags(tags) {
  return [...tags].sort(
    (a, b) => CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category)
  )
}

