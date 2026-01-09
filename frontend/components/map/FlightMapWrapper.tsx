'use client';

import dynamic from 'next/dynamic';
import { Box, CircularProgress } from '@mui/material';
import { colors } from '@/theme/theme';

const FlightMap = dynamic(() => import('./FlightMap'), {
  ssr: false,
  loading: () => (
    <Box
      sx={{
        height: 400,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.background.tertiary,
        borderRadius: 2,
        border: `1px solid ${colors.border.default}`,
      }}
    >
      <CircularProgress size={32} />
    </Box>
  ),
});

export default FlightMap;
