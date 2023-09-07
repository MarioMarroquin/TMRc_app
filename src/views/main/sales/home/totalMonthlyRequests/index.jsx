import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import { GET_TOTAL_REQUESTS } from './requests';
import { useEffect, useState } from 'react';
import {
	Box,
	Card,
	CardContent,
	CardHeader,
	CircularProgress,
	Typography,
} from '@mui/material';
import { endOfMonth, format, startOfMonth } from 'date-fns';
import { es } from 'date-fns/locale';

const TotalMonthlyRequests = (props) => {
	const [total, setTotal] = useState(0);
	const { data, loading, refetch } = useQuery(GET_TOTAL_REQUESTS);

	useEffect(() => {
		if (data) {
			const aux = data?.totalRequestsMonthlyBySeller.total;
			setTotal(aux);
		}
	}, [data]);

	return (
		<Card sx={{ height: '100%' }}>
			<CardHeader
				title={'Solicitudes mensuales'}
				subheader={`${format(startOfMonth(new Date()), 'dd / MMM / yy', {
					locale: es,
				})}  al  ${format(endOfMonth(new Date()), 'dd / MMM / yy', {
					locale: es,
				})}`}
				titleTypographyProps={{ fontSize: 18, fontWeight: 500 }}
				subheaderTypographyProps={{ fontSize: 12, fontWeight: 400 }}
			/>
			<CardContent>
				<Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
					{loading ? (
						<CircularProgress />
					) : (
						<Typography fontSize={36} fontWeight={500}>
							{total}
						</Typography>
					)}
				</Box>
			</CardContent>
		</Card>
	);
};

TotalMonthlyRequests.propTypes = {};

export default TotalMonthlyRequests;
