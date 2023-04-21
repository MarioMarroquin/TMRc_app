import { Fragment, useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_CALLS } from './requests';
import { useLoading } from '@providers/loading';
import moment from 'moment/moment';
import {
	Button,
	Card,
	CardContent,
	CardHeader,
	Fab,
	Grid,
	LinearProgress,
	Paper,
	Toolbar,
} from '@mui/material';
import CustomDataGrid from '@components/customDataGrid';
import ClientCard from '@views/main/clients/components/clientCard';
import { format } from 'date-fns';
import shadows from '@config/theme/base/shadows';
import { pxToRem } from '@config/theme/functions';
import { Add } from '@mui/icons-material';
import NewCallDialog from '@views/main/calls/components/newCallDialog';

const headers = [
	{
		field: 'createdAt',
		headerName: 'FECHA',
		headerAlign: 'left',
		align: 'left',
		width: 300,
		valueFormatter: (params) => {
			return format(new Date(params.value), 'dd/MM/yyyy - HH:mm');
		},
	},
	{
		field: 'client',
		headerName: 'CLIENTE',
		headerAlign: 'center',
		align: 'center',
		flex: 1,
		minWidth: 200,
		valueGetter: (params) => {
			if (params.row.client === null) {
				return 'Sin cliente';
			} else {
				return params.row.client.firstName + ' ' + params.row.client.lastName;
			}
		},
	},

	{
		field: 'duration',
		headerName: 'DURACIÓN (min)',
		headerAlign: 'center',
		align: 'center',
		width: 120,
	},
];

const Calls = () => {
	const { setLoading } = useLoading();
	const [calls, setCalls] = useState([]);
	const [countRows, setCountRows] = useState(0);
	const [paginationModel, setPaginationModel] = useState({
		page: 0,
		pageSize: 5,
	});
	const { data, loading, refetch } = useQuery(GET_CALLS, {
		variables: {
			params: {
				page: paginationModel.page,
				pageSize: paginationModel.pageSize,
			},
		},
	});

	useEffect(() => {
		setLoading(true);
		if (data) {
			const aux = data.calls.results;
			const auxCount = data.calls.info.count;
			setCalls(aux);
			setCountRows(auxCount);
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
				<Grid item xs={12}>
					<Card>
						<CardContent>
							<Toolbar variant={'dense'}>
								<NewCallDialog />
							</Toolbar>
							<CustomDataGrid
								rows={calls}
								columns={headers}
								loading={loading}
								slots={{
									loadingOverlay: LinearProgress,
								}}
								slotProps={{ loadingOverlay: { color: 'secondary' } }}
								rowCount={countRows}
								paginationModel={paginationModel}
								onPaginationModelChange={setPaginationModel}
							/>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
			<Fab sx={{ position: 'absolute', bottom: 16, right: 16 }}>
				<Add />
			</Fab>
		</Fragment>
	);
};

export default Calls;
