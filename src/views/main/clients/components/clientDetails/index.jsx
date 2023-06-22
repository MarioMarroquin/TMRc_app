import PropTypes from 'prop-types';
import { Card, CardContent, Grid } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useLoading } from '@providers/loading';
import { useEffect, useState } from 'react';
import { GET_CLIENT } from './requests';
import { useQuery } from '@apollo/client';
import shadows from '@config/theme/base/shadows';

const ClientDetails = (props) => {
	const { id } = useParams();
	const { setLoading } = useLoading();
	const [client, setClient] = useState();

	const { data, loading } = useQuery(GET_CLIENT, {
		variables: { clientId: id },
	});

	useEffect(() => {
		setLoading(true);
		if (data) {
			const aux = data.client;
			console.log(aux);
			setClient(aux);
		}
		setLoading(false);
	}, [data]);

	return (
		<Grid container spacing={2}>
			<Grid item xs={12} sm={8}>
				<Card>
					<CardContent>Cliente</CardContent>
				</Card>
			</Grid>

			<Grid item xs={12} sm={4}>
				<Card>
					<CardContent>Llamadas historial</CardContent>
				</Card>
			</Grid>

			<Grid item xs={12}>
				<Card>
					<CardContent>TOdas las tasks relacionadas a el</CardContent>
				</Card>
			</Grid>
		</Grid>
	);
};

ClientDetails.propTypes = {};

export default ClientDetails;
