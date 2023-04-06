import { Fragment, useEffect, useRef, useState } from 'react';
import {
	Avatar,
	Box,
	Button,
	Card,
	CardContent,
	CardHeader,
	ClickAwayListener,
	Collapse,
	Grid,
	Paper,
	Toolbar,
	Typography,
} from '@mui/material';
import Chart from 'react-apexcharts';
import CustomDataGrid from '@components/customDataGrid';
import NewClientDialog from '@views/main/clients/components/newClientDialog';
import { useQuery } from '@apollo/client';
import { GET_CLIENTS } from '@views/main/clients/requests';
import moment from 'moment';
import ClientDetails from '@views/main/clients/components/clientDetails';
import {
	GridToolbar,
	GridToolbarContainer,
	GridToolbarQuickFilter,
	useGridApiRef,
} from '@mui/x-data-grid';
import { Search } from '@mui/icons-material';

const Clients = () => {
	const [clients, setClients] = useState([]);
	const [selectionModel, setSelectionModel] = useState([]);
	const [selectedClient, setSelectedClient] = useState();

	const ref = useRef();

	const { data, refetch } = useQuery(GET_CLIENTS);

	useEffect(() => {
		if (data) {
			const aux = data.clients.results;
			setClients(aux);
		}
	}, [data]);

	const headers = [
		{
			field: 'user',
			headerName: 'Nombre de usuario',
			headerAlign: 'center',
			align: 'center',
			flex: 1,
			minWidth: 200,
			valueGetter: (params) => {
				if (params.row.client === null) {
					return 'Sin cliente';
				} else {
					return params.row.firstName + ' ' + params.row.lastName;
				}
			},
		},

		{
			field: 'phoneNumber',
			headerName: 'Teléfono',
			headerAlign: 'center',
			align: 'center',
			width: 200,
		},
		{
			field: 'createdAt',
			headerName: 'Actualizado',
			headerAlign: 'center',
			align: 'center',
			width: 200,
			valueFormatter: (params) => {
				const date = new Date(params.value);
				const formattedDate = moment(date).format('DD/MM/YYYY hh:mm a');

				return formattedDate;
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
			<NewClientDialog reloadClients={refetch} />
		</GridToolbarContainer>
	);

	return (
		<Fragment>
			{/*<Paper>*/}
			{/*	<Toolbar variant={'dense'} sx={{ mb: 2 }}>*/}
			{/*		<NewClientDialog reloadClients={refetch} />*/}
			{/*	</Toolbar>*/}
			{/*</Paper>*/}

			<Grid container spacing={2}>
				<Grid item xs={12} md={9}>
					<Card>
						<CardHeader title='Clientes' subheader='Total' sx={{ pb: 0 }} />
						<CardContent>
							<div>
								<CustomDataGrid
									rows={clients}
									columns={headers}
									onRowClick={(data, e) => {
										setSelectedClient(data.row);
										ref.current?.scrollIntoView({ behavior: 'smooth' });
									}}
									onRowSelectionModelChange={handleClick}
									rowSelectionModel={selectionModel}
									slots={{ toolbar: CustomToolbar }}
								/>
							</div>
						</CardContent>
					</Card>
				</Grid>

				<Grid ref={ref} item xs={12} md={3}>
					<ClientDetails client={selectedClient} />
				</Grid>
			</Grid>
		</Fragment>
	);
};

export default Clients;
