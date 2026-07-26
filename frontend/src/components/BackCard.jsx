// src/components/BackCard.jsx
//
// Slim back-navigation card. Infers its target by stripping the last URL segment,
// so it always goes "up one level" in the card tree. Styling is intentionally
// rough for now — will be polished later (wide "<", slim bar, etc.).

import { Card, CardActionArea, Typography } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { cardStyles } from '../constants/cardStyles';

export default function BackCard() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // strip trailing slash, drop the last segment -> parent path
  const parent =
    pathname.replace(/\/$/, '').split('/').slice(0, -1).join('/') || '/';

  const style = cardStyles.back;

  return (
    <Card
      onClick={() => navigate(parent)}
      sx={{
        border: `1px solid ${style.border}`,
        backgroundColor: style.bg,
        height: style.height,
        width: style.width,
        alignSelf: 'flex-start',
        mb: 2,
        cursor: 'pointer',
      }}
    >
      <CardActionArea sx={{ px: 2, py: 0.5 }}>
        <Typography variant="h5">{'<'}</Typography>
      </CardActionArea>
    </Card>
  );
}