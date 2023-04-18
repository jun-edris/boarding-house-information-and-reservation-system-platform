import Chart from 'react-apexcharts';
import { Card } from '@mui/material';

const ReservedChart = ({ data }) => {
	const countByDate = data.reduce((acc, curr) => {
		const date = curr.updatedAt.substring(0, 10);
		if (acc[date]) {
			acc[date]++;
		} else {
			acc[date] = 1;
		}
		return acc;
	}, {});

	const chartData = Object.entries(countByDate).map(([date, count]) => ({
		x: new Date(date).getTime(),
		y: count,
	}));

	const options = {
		chart: {
			type: 'bar',
			height: 350,
		},
		xaxis: {
			type: 'datetime',
			labels: {
				formatter: function (value, timestamp) {
					const date = new Date(value);
					const options = { weekday: 'short', month: 'short', day: 'numeric' };
					const formattedDate = date.toLocaleDateString('en-US', options);
					return formattedDate;
				},
			},
			tickAmount: 7,
			tickPlacement: 'between',
		},
		yaxis: {
			title: {
				text: 'Number of Tenants Living',
			},
		},
	};

	return (
		<div>
			<Card variant='outlined' xs={{ p: 5 }}>
				<Chart options={options} series={[{ name: 'Living Tenants', data: chartData }]} type='line' height={350} />
			</Card>
		</div>
	);
};

export default ReservedChart;
