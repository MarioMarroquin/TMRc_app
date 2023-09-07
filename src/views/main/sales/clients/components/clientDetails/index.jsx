import PropTypes from 'prop-types';
import { Card, CardContent, Grid, LinearProgress } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useLoading } from '@providers/loading';
import { useEffect, useState } from 'react';
import { GET_CLIENT, GET_REQUESTS_BY_CLIENT } from './requests';
import { useQuery } from '@apollo/client';
import shadows from '@config/theme/base/shadows';
import CustomDataGrid from '@components/customDataGrid';
import { endOfMonth, startOfMonth } from 'date-fns';
import { headers } from '@views/main/sales/clients/components/clientDetails/headers';

const ClientDetails = (props) => {
	const { id } = useParams();
	const { setLoading } = useLoading();
	const [client, setClient] = useState();
	const [clientRequests, setClientRequests] = useState([]);
	const [countRows, setCountRows] = useState(0);
	const [paginationModel, setPaginationModel] = useState({
		page: 0,
		pageSize: 5,
	});

	const { data, loading } = useQuery(GET_CLIENT, {
		variables: { clientId: id },
	});

	const { data: dataClientReqs, loading: loadingClientReqs } = useQuery(
		GET_REQUESTS_BY_CLIENT,
		{
			variables: {
				params: {
					page: 0,
					pageSize: 5,
				},
				dateRange: {
					start: startOfMonth(new Date()),
					end: endOfMonth(new Date()),
				},
				clientId: id,
			},
		}
	);

	useEffect(() => {
		setLoading(true);
		if (data && dataClientReqs) {
			const aux = data.client;
			const auxReqs = dataClientReqs.requestsByClient.results;
			console.log(auxReqs);
			setClient(aux);
			setClientRequests(auxReqs);
		}
		setLoading(false);
	}, [data, dataClientReqs]);

	return (
		<Grid container spacing={2}>
			<Grid item xs={12} sm={8}>
				<Card>
					<CardContent>Cliente</CardContent>
				</Card>
			</Grid>

			<Grid item xs={12}>
				<Card>
					<CardContent>
						<CustomDataGrid
							rows={clientRequests}
							columns={headers}
							loading={loadingClientReqs}
							slots={{
								loadingOverlay: LinearProgress,
							}}
							slotProps={{ loadingOverlay: { color: 'secondary' } }}
							hideFooter
							rowCount={0}
						/>
						TOdas las tasks relacionadas a el
					</CardContent>
				</Card>
			</Grid>
		</Grid>
	);
};

ClientDetails.propTypes = {};

export default ClientDetails;
