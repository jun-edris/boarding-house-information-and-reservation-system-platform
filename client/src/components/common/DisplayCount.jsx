import { Box, Card, CardContent, Typography, useTheme } from '@mui/material';
import React from 'react';

const DisplayCount = ({ count, icon, title }) => {
	const theme = useTheme();
	return (
		<Card variant='outlined' sx={{ display: 'flex' }}>
			<Box sx={{ backgroundColor: theme.palette.background.default, padding: 5 }}>{icon}</Box>
			<CardContent sx={{ width: '100%' }}>
				<Typography variant='h2'>{count}</Typography>
				<Typography variant='body1' component='p' sx={{ mt: 2 }}>
					{title}
				</Typography>
			</CardContent>
		</Card>
	);
};

export default DisplayCount;
