// src/pages/_stubs/StubPage.jsx
//
// Reusable "work in progress" filler, styled after the Log History page.
// Used to stand in for real pages that aren't built yet, so it's obvious
// which routes are stubs vs borrowed real components.
//
// Usage in a route config:  element: <StubPage label="Templates" />

import { Grid, Box } from '@mui/material';

export default function StubPage({ label = 'Page' }) {
  return (
    <Grid
      sx={{
        backgroundColor: '#1c1c1c',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        flexDirection: 'column',
      }}
    >
      <Box className="title-font" component="h1">
        {label}
      </Box>
      <Box color="#bc7516" className="title-font" component="h3">
        ~Work in progress~
      </Box>
    </Grid>
  );
}