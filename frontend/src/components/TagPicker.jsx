// src/components/TagPicker.jsx
import { useEffect, useState } from 'react'
import { Box, Chip, Typography, Divider } from '@mui/material'
import { tagSx, groupTags } from '../utils/tagStyles'

export default function TagPicker({ fetchTags, value = [], onChange, readOnly = false, label = 'Tags' }) {
  const [tags, setTags] = useState([])

  useEffect(() => {
    let cancelled = false
    fetchTags().then(t => { if (!cancelled) setTags(t) }).catch(() => {})
    return () => { cancelled = true }
  }, [fetchTags])

  const toggle = slug =>
    onChange(value.includes(slug) ? value.filter(s => s !== slug) : [...value, slug])

  const source = readOnly ? tags.filter(t => value.includes(t.slug)) : tags
  const sections = groupTags(source)

  return (
    <Box>
      <Typography variant="caption" sx={{ opacity: 0.7 }}>{label}</Typography>
      {sections.length === 0 && readOnly && (
        <Typography variant="body2" sx={{ opacity: 0.5, mt: 0.5 }}>None</Typography>
      )}
      {sections.map(({ section, tags: sectionTags }, i) => (
        <Box key={section} sx={{ mt: i === 0 ? 0.5 : 1.25 }}>
          <Typography
            variant="overline"
            sx={{ opacity: 0.55, fontSize: '0.65rem', letterSpacing: 0.8, display: 'block' }}
          >
            {section}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mt: 0.25 }}>
            {sectionTags.map(t => (
              <Chip
                key={t.slug}
                label={t.name}
                size="small"
                variant="outlined"
                onClick={readOnly ? undefined : () => toggle(t.slug)}
                sx={{
                  ...tagSx(t, { filled: readOnly ? true : value.includes(t.slug) }),
                  ...(readOnly && { cursor: 'default', pointerEvents: 'none' }),
                }}
              />
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  )
}