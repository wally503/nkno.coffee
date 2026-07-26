import { Grid, Card, CardActionArea, CardContent, Container, Typography, Box } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adjustmentOptionsRow1, adjustmentOptionsRow2 } from '../constants/routes/adjustmentRoutes';
import CardPageBodyLayout from './CardPageBodyLayout';

export default function CardNavSelect({ options, rows, isNavRoot = false }){
  const rowGroups = rows ?? [options];

  return (
    <CardPageBodyLayout showBack={!isNavRoot}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap, maxWidth }}>
        {rowGroups.map((group, i) => (
          <Box key={i} sx={{
            display: 'flex',
            gap,
            justifyContent: 'center',
            flexWrap: rows ? 'nowrap' : 'wrap',   // explicit rows don't wrap; flat does
          }}>
            {group.map((option) => (
              <SelectCard key={option.id} option={option} />
            ))}
          </Box>
        ))}
      </Box>
    </CardPageBodyLayout>
  );
}