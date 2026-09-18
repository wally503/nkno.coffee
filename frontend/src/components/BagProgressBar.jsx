import * as React from 'react';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

const BorderLinearProgress = styled(LinearProgress)(({ theme, barcolor }) => ({
  height: 15,
  borderRadius: 10,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[200],
    ...theme.applyStyles('dark', {
      backgroundColor: theme.palette.grey[800],
    }),
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: barcolor,
  },
}));

// Light tan (low/empty) -> dark brown (full/fresh)
const LOW_COLOR = { r: 224, g: 196, b: 160 };  // light tan, ~#E0C4A0
const HIGH_COLOR = { r: 58, g: 38, b: 26 };    // dark brown, ~#3A261A

function lerp(a, b, t) {
  return Math.round(a + (b - a) * t);
}

function getIntensityColor(value) {
  if (value == null) return '#8B5E3C'; // fallback, no data — matches theme primary
  const t = Math.min(Math.max(value, 0), 100) / 100;
  const r = lerp(LOW_COLOR.r, HIGH_COLOR.r, t);
  const g = lerp(LOW_COLOR.g, HIGH_COLOR.g, t);
  const b = lerp(LOW_COLOR.b, HIGH_COLOR.b, t);
  return `rgb(${r}, ${g}, ${b})`;
}

export default function BagProgressBar({ progValue }) {
  return (
    <Stack>
        <BorderLinearProgress
            variant="determinate"
            value={progValue ?? 0}
            barcolor={getIntensityColor(progValue)}
            aria-label="Bag remaining"
        />
    </Stack>
  );
}