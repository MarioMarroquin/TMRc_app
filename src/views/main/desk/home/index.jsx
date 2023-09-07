import { Fragment, useState } from 'react';
import Chart from 'react-apexcharts';
import {
	Card,
	CardContent,
	CardHeader,
	Grid,
	Paper,
	Typography,
} from '@mui/material';
import { pxToRem } from '@config/theme/functions';
import { useSession } from '@providers/session';

const Home = () => {
	const { user } = useSession();

	const [state, setState] = useState({
		options: {
			fill: {
				type: 'gradient',
				gradient: {
					shade: 'light',
					type: 'vertical',
					shadeIntensity: 0.5,
					gradientToColors: undefined, // optional, if not defined - uses the shades of same color in series
					inverseColors: true,
					opacityFrom: 0.8,
					opacityTo: 0,
					stops: [],
				},
				colors: ['#2D3748'],
			},
			colors: ['#2D3748'],

			chart: {
				toolbar: {
					show: false,
				},
			},
			tooltip: {
				theme: 'dark',
			},
			dataLabels: {
				enabled: false,
			},
			stroke: {
				curve: 'smooth',
			},
			yaxis: {
				labels: {
					style: {
						colors: '#c8cfca',
						fontSize: '12px',
					},
				},
			},
			legend: {
				show: false,
			},
			grid: {
				strokeDashArray: 5,
			},
		},
		series: [
			{
				name: 'series-1',
				data: [30, 40, 35, 50, 49, 60, 70, 91, 125],
			},
		],
	});

	const optionss = {
		series: [44, 55, 13, 43, 22],
		options: {
			labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
			theme: {
				monochrome: {
					enabled: true,
					color: '#2D3748',
					shadeTo: 'light',
					shadeIntensity: 0.65,
				},
			},
		},
	};

	return (
		<Fragment>
			<Typography fontSize={pxToRem(26)}>¡Bienvenido!</Typography>
			<Typography fontSize={pxToRem(32)} fontWeight={500}>
				{`${user?.firstName} ${user?.lastName}`}
			</Typography>

			<Grid container rowSpacing={3} columnSpacing={{ xs: 0, sm: 4 }} mt={2}>
				<Grid item xs={6}>
					<Card>
						<CardHeader title='Gráfica' subheader='Ejemplo %' />
						<CardContent>
							<Chart
								options={state.options}
								series={state.series}
								type='area'
								height={300}
							/>
						</CardContent>
					</Card>
				</Grid>

				<Grid item xs={6}>
					<Card>
						<CardHeader title='Gráfica' subheader='Ejemplo %' />
						<CardContent>
							<Chart
								options={optionss.options}
								series={optionss.series}
								type='pie'
								height={300}
							/>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</Fragment>
	);
};

export default Home;
