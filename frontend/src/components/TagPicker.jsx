// src/components/TagPicker.jsx
import { useEffect, useState } from 'react'
import { Box, Chip, Typography } from '@mui/material'
import { tagSx, sortTags } from '../utils/tagStyles'

export default function TagPicker({ fetchTags, value = [], onChange, readOnly = false, label = 'Tags' }) {
  const [tags, setTags] = useState([])

  useEffect(() => {
    let cancelled = false
    fetchTags().then(t => { if (!cancelled) setTags(sortTags(t)) }).catch(() => {})
    return () => { cancelled = true }
  }, [fetchTags])

  const toggle = slug =>
    onChange(value.includes(slug) ? value.filter(s => s !== slug) : [...value, slug])

  const shown = readOnly ? tags.filter(t => value.includes(t.slug)) : tags

  return (
    <Box>
      <Typography variant="caption" sx={{ opacity: 0.7 }}>{label}</Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mt: 0.5 }}>
        {readOnly && shown.length === 0 && (
          <Typography variant="body2" sx={{ opacity: 0.5 }}>None</Typography>
        )}
        {shown.map(t => (
          <Chip
            key={t.slug}
            label={t.name}
            size="small"
            variant="outlined"
            onClick={readOnly ? undefined : () => toggle(t.slug)}
            sx={{
              ...tagSx(t, { filled: readOnly ? true : value.includes(t.slug) }),
              ...(readOnly && {
                cursor: 'default',
                pointerEvents: 'none',   // no hover, no click
              }),
            }}
          />
        ))}
      </Box>
    </Box>
  )
}