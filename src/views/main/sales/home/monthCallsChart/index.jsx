import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_MONTH_CALLS_COUNT } from '@views/main/sales/home/monthCallsChart/requests';
import { useLoading } from '@providers/loading';
import Chart from 'react-apexcharts';
import { Card, CardContent, CardHeader, useTheme } from '@mui/material';

const MonthCallsChart = () => {
	const { setLoading } = useLoading();
	const theme = useTheme();

	const [report, setReport] = useState({
		options: {
			chart: {
				id: 'CallsPerMonth',
				defaultLocale: 'es',
				locales: [
					{
						name: 'es',
						options: {
							months: [
								'Enero',
								'Febrero',
								'Marzo',
								'Abril',
								'Mayo',
								'Junio',
								'Julio',
								'Agosto',
								'Septiembre',
								'Octubre',
								'Noviembre',
								'Diciembre',
							],
							shortMonths: [
								'Ene',
								'Feb',
								'Mar',
								'Abr',
								'May',
								'Jun',
								'Jul',
								'Ago',
								'Sep',
								'Oct',
								'Nov',
								'Dic',
							],
							days: [
								'Domingo',
								'Lunes',
								'Martes',
								'Miércoles',
								'Jueves',
								'Viernes',
								'Sábado',
							],
							shortDays: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
							toolbar: {
								download: 'Descargar SVG',
								selection: 'Selección',
								selectionZoom: 'Selection Zoom',
								zoomIn: 'Zoom In',
								zoomOut: 'Zoom Out',
								pan: 'Panning',
								reset: 'Reset Zoom',
							},
						},
					},
				],
				toolbar: {
					show: false,
				},
			},
			dataLabels: { enabled: false },
			stroke: {
				curve: ['smooth', 'straight', 'straight'],
			},
			grid: {
				strokeDashArray: 5,
			},
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
			},
			tooltip: {
				theme: 'dark',
				x: {
					show: true,
					format: 'dd MMM',
					formatter: undefined,
				},
			},
			legend: {
				show: true,
			},
			xaxis: {
				categories: [
					'Ene',
					'Feb',
					'Mar',
					'Abr',
					'May',
					'Jun',
					'Jul',
					'Ago',
					'Sep',
					'Oct',
					'Nov',
					'Dic',
				],
				labels: {
					show: true,
					rotate: -45,
					rotateAlways: true,
				},
			},
			yaxis: {
				labels: {
					formatter: function (val) {
						return Math.floor(val);
					},
					style: {
						colors: theme.palette.text.secondary,
						fontSize: '10px',
					},
				},
			},
		},
		series: [],
	});

	const { data, loading, refetch } = useQuery(GET_MONTH_CALLS_COUNT);

	useEffect(() => {
		setLoading(true);
		if (data) {
			const aux = data.monthlyCallsReport;

			setReport({
				...report,
				series: [
					{ name: 'Total', data: aux.monthlyCalls },
					{ name: 'Salientes', data: aux.monthlyOutgoingCalls },
					{ name: 'Entrantes', data: aux.monthlyIngoingCalls },
				],
			});
		}

		setLoading(false);
	}, [data]);

	return (
		<Card>
			<CardHeader title='Llamadas por mes' />
			<CardContent>
				<Chart
					options={report.options}
					series={report.series}
					type={'area'}
					height={300}
				/>
			</CardContent>
		</Card>
	);
};

export default MonthCallsChart;
