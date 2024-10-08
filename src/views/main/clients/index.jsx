import { Fragment, useEffect, useRef, useState } from 'react';
import { Card, CardContent, Grid, LinearProgress } from '@mui/material';
import CustomDataGrid from '@components/customDataGrid';
import { useQuery } from '@apollo/client';
import { GridToolbarContainer, GridToolbarQuickFilter } from '@mui/x-data-grid';
import { format } from 'date-fns';
import { GET_CLIENTS } from './requests';
import ClientCreateDialog from './ClientCreateDialog';
import ClientCard from './ClientCard';

const Clients = () => {
	const [clients, setClients] = useState([]);
	const [countRows, setCountRows] = useState(0);
	const [paginationModel, setPaginationModel] = useState({
		page: 0,
		pageSize: 5,
	});
	const [selectionModel, setSelectionModel] = useState([]);
	const [selectedClient, setSelectedClient] = useState();

	const ref = useRef();

	const { data, refetch, loading } = useQuery(GET_CLIENTS, {
		variables: {
			params: {
				page: paginationModel.page,
				pageSize: paginationModel.pageSize,
			},
		},
	});

	useEffect(() => {
		if (data) {
			const aux = data.clients.results;
			const auxCount = data.clients.info.count;
			setCountRows(auxCount);
			setClients(aux);
		}
	}, [data]);

	const headers = [
		{
			field: 'client',
			headerName: 'NOMBRE',
			headerAlign: 'left',
			align: 'left',
			flex: 1,
			minWidth: 200,
			valueGetter: (params) => {
				return params.row.firstName + ' ' + params.row.lastName;
			},
		},

		{
			field: 'phoneNumber',
			headerName: 'TELÉFONO',
			headerAlign: 'center',
			align: 'center',
			width: 200,
		},
		{
			field: 'createdAt',
			headerName: 'ULT. ACTUALIZACIÓN',
			headerAlign: 'center',
			align: 'center',
			width: 200,
			valueFormatter: (params) => {
				return format(new Date(params.value), 'dd/MM/yyyy - HH:mm');
			},
		},
	];

	const handleClick = (selection) => {
		setSelectionModel(selection);
		if (!selection.length) setSelectedClient();
	};

	const CustomToolbar = () => (
		<GridToolbarContainer sx={{ justifyContent: 'flex-end' }}>
			<GridToolbarQuickFilter variant={'outlined'} margin={'dense'} />
			<ClientCreateDialog reloadClients={refetch} />
		</GridToolbarContainer>
	);

	return (
		<Fragment>
			<Grid container spacing={2}>
				<Grid item xs={12} md={9}>
					<Card>
						<CardContent>
							<CustomDataGrid
								rows={clients}
								columns={headers}
								loading={loading}
								slots={{
									toolbar: CustomToolbar,
									loadingOverlay: LinearProgress,
								}}
								slotProps={{ loadingOverlay: { color: 'secondary' } }}
								rowCount={countRows}
								paginationMode={'server'}
								paginationModel={paginationModel}
								onPaginationModelChange={setPaginationModel}
								rowSelectionModel={selectionModel} // para saber cual esta seleccionada
								onRowSelectionModelChange={handleClick}
								onRowClick={(data, e) => {
									setSelectedClient(data.row);
									ref.current?.scrollIntoView({ behavior: 'smooth' });
								}}
							/>
						</CardContent>
					</Card>
				</Grid>

				<Grid ref={ref} item xs={12} md={3}>
					<ClientCard client={selectedClient} />
				</Grid>
			</Grid>
		</Fragment>
	);
};

export default Clients;
