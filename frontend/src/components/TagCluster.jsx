//src/components/TagCluster.jsx
import { Box, Chip } from '@mui/material'
import { tagSx, sortTags } from '../utils/tagStyles'
import { TAG_DENSITY } from '../constants/tags'

// density can be:
//   'compact'                  a preset name
//   0.8                        a scale (1 = normal size)
//   { scale: 0.8, gap: 1 }     a scale plus per-value overrides
//   { height: 20 }             plain overrides on 'normal'
function resolveDensity(density) {
  if (typeof density === 'string') return TAG_DENSITY[density] ?? TAG_DENSITY.normal

  const { scale, ...overrides } =
    typeof density === 'number' ? { scale: density } : (density ?? {})

  const base = TAG_DENSITY.normal
  const s = scale ?? 1
  return {
    height: Math.round(base.height * s),
    fontSize: `${(0.8125 * s).toFixed(3)}rem`,
    labelPx: base.labelPx * s,
    gap: base.gap * s,
    textTint: s < 1 ? 0.35 : 0,     // lighten the text as chips shrink
    ...overrides,
  }
}

export default function TagCluster({ tags = [], density = 'normal', palette = 'default' }) {
  if (!tags.length) return null
  const d = resolveDensity(density)
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: d.gap }}>
      {sortTags(tags).map(t => (
        <Chip
          key={t.slug}
          label={t.name}
          size="small"
          variant="outlined"
          sx={{
            ...tagSx(t, { filled: false, glow: true, textTint: d.textTint, palette }),
            height: d.height,
            fontSize: d.fontSize,
            '& .MuiChip-label': { px: d.labelPx },
          }}
        />
      ))}
    </Box>
  )
}