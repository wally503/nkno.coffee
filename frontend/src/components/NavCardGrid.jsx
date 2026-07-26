// src/components/CardSelect.jsx
//
// Generic card-select grid. Two layout modes:
//   - flat:  pass `options` (an array)          -> single wrapping row
//   - rows:  pass `rows` (array of arrays)       -> explicit rows, no wrap
// Back navigation shows unless `isNavRoot` is true (top-level nav destinations).
//
// Usage:
//   <CardSelect rows={[row1, row2]} />           coffeelog-style, semantic rows
//   <CardSelect options={controlOptions} />      flat, order-agnostic (controls)
//   <CardSelect rows={[...]} isNavRoot />         no back card
 
import { Box } from '@mui/material';
import CardPageBodyLayout from './CardPageBodyLayout';
import SelectCard from './SelectCard';
 
export default function NavCardGrid({
  options,
  rows,
  isNavRoot = false,
  gap = 3,
  maxWidth = 1200,
}) {
  // normalize: rows given -> use them; else wrap flat options as a single group
  const groups = rows ?? [options ?? []];
  const useRows = Boolean(rows);
 
  return (
    <CardPageBodyLayout showBack={!isNavRoot}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap,
          maxWidth,
        }}
      >
        {groups.map((group, i) => (
          <Box
            key={i}
            sx={{
              display: 'flex',
              gap,
              justifyContent: 'center',
              flexWrap: useRows ? 'nowrap' : 'wrap',
            }}
          >
            {group.map((option) => (
              <SelectCard key={option.id} option={option} />
            ))}
          </Box>
        ))}
      </Box>
    </CardPageBodyLayout>
  );
}