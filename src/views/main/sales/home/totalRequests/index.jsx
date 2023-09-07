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

const TotalRequests = (props) => {
	const [total, setTotal] = useState(0);
	const { data, loading, refetch } = useQuery(GET_TOTAL_REQUESTS);

	useEffect(() => {
		if (data) {
			const aux = data?.totalRequestsBySeller.total;
			setTotal(aux);
		}
	}, [data]);

	return (
		<Card sx={{ height: '100%' }}>
			<CardHeader
				title={'Solicitudes totales'}
				subheader={'Completas'}
				titleTypographyProps={{ fontSize: 18, fontWeight: 500 }}
				subheaderTypographyProps={{ fontSize: 12, fontWeight: 400 }}
			/>
			<CardContent>
				<Box
					sx={{
						width: '100%',
						mt: 'auto',
						display: 'flex',
						justifyContent: 'center',
					}}
				>
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

TotalRequests.propTypes = {};

export default TotalRequests;
