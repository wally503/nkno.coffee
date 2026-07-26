// src/components/CardPageBodyLayout.jsx
//
// Base layout for card pages. Now accepts `showBack` — when true, renders the
// slim BackCard as chrome above the children. Layout stays dumb: it doesn't
// decide whether to show back, it just honors what it's told (CardSelect passes
// showBack = !isNavRoot from the menu config).

import { Box } from '@mui/material';
import BackCard from './BackCard';

export default function CardPageBodyLayout({ children, showBack = false }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        px: 4,
        py: 4,
        width: '100%',
        height: 'calc(100vh - 69px)',
        position: 'relative',
      }}
    >
      {showBack && <BackCard />}
      {children}
    </Box>
  );
}