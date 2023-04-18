import { Fragment, useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_CALLS } from './requests';
import { useLoading } from '@providers/loading';
import moment from 'moment/moment';
import { Card, CardContent, CardHeader, Grid, Paper } from '@mui/material';
import CustomDataGrid from '@components/customDataGrid';
import ClientCard from '@views/main/clients/components/clientCard';
import { format } from 'date-fns';
import shadows from '@config/theme/base/shadows';
import { pxToRem } from '@config/theme/functions';

const headers = [
	{
		field: 'createdAt',
		headerName: 'FECHA',
		headerAlign: 'left',
		align: 'left',
		width: 400,
		valueFormatter: (params) => {
			return format(new Date(params.value), 'dd / MM / yyyy - HH:mm');
		},
	},
	// {
	// 	field: 'user',
	// 	headerName: 'Nombre de usuario',
	// 	headerAlign: 'center',
	// 	align: 'center',
	// 	flex: 1,
	// 	minWidth: 200,
	// 	valueGetter: (params) => {
	// 		if (params.row.client === null) {
	// 			return 'Sin cliente';
	// 		} else {
	// 			return params.row.firstName + ' ' + params.row.lastName;
	// 		}
	// 	},
	// },
	//
	// {
	// 	field: 'phoneNumber',
	// 	headerName: 'Teléfono',
	// 	headerAlign: 'center',
	// 	align: 'center',
	// 	width: 200,
	// },
];

const Calls = () => {
	const { setLoading } = useLoading();
	const [calls, setCalls] = useState([]);

	const { data, refetch } = useQuery(GET_CALLS);

	useEffect(() => {
		setLoading(true);
		if (data) {
			const aux = data.calls.results;
			setCalls(aux);
		}

		setLoading(false);
	}, [data]);

	return (
		<Fragment>
			{/* <Paper> */}
			{/*	<Toolbar variant={'dense'} sx={{ mb: 2 }}> */}
			{/*		<NewClientDialog reloadClients={refetch} /> */}
			{/*	</Toolbar> */}
			{/* </Paper > */}

			<Grid container spacing={2}>
				<Grid item xs={12} md={9}>
					<Card>
						<CardContent>
							<CustomDataGrid rows={calls} columns={headers} />
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</Fragment>
	);
};

export default Calls;
