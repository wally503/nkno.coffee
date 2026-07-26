// src/components/SelectCard.jsx
//
// Generic select card. Renders one option, resolves its visual style by name
// from the shared cardStyles pool, navigates by option.path on click.
// Replaces the per-page bespoke LogTypeCard in every card-select screen.

import { Card, CardActionArea, CardContent, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { cardStyles, DEFAULT_CARD_STYLE } from '../constants/cardStyles';

export default function SelectCard({ option }) {
  const navigate = useNavigate();
  const style =
    cardStyles[option.cardStyle] ?? cardStyles[DEFAULT_CARD_STYLE];

  return (
    <Card
      sx={{
        border: `1px solid ${style.border}`,
        //backgroundColor: style.bg,
        height: style.height,
        width: style.width,
        transition: '0.2s',
        display: 'flex',
      }}
    >
      <CardActionArea
        onClick={() => navigate(option.path)}
        sx={{ cursor: 'pointer' }}
      >
        <CardContent>
          <Typography variant="h5" gutterBottom>
            {option.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {option.description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}