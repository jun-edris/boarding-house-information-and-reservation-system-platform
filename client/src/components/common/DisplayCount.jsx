import { Box, Card, CardActions, CardContent, Typography } from '@mui/material';
import React from 'react';

const DisplayCount = ({ count, icon, title, colorBG }) => {
  return (
    <Card variant="outlined">
      <CardContent sx={{ width: '100%', p: 3, bgcolor: colorBG }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ padding: 3 }}>
            <Typography variant="h1" component="h2" sx={{ color: 'white' }}>
              {count}
            </Typography>
            <Typography
              variant="body1"
              component="p"
              sx={{ mt: 2, color: 'white' }}
            >
              {title}
            </Typography>
          </Box>
          <Box
            sx={{
              padding: 3,
              color: 'white',
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
      <CardActions sx={{ p: 3 }}></CardActions>
    </Card>
  );
};

export default DisplayCount;
