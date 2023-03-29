import { Fragment, useEffect, useRef, useState } from 'react';
import {
	Avatar,
	Box,
	Button,
	Card,
	CardContent,
	CardHeader,
	Collapse,
	Grid,
	Toolbar,
	Typography,
} from '@mui/material';
import Chart from 'react-apexcharts';
import CustomDataGrid from '@components/customDataGrid';
import NewClientDialog from '@views/main/clients/components/newClientDialog';
import { useQuery } from '@apollo/client';
import { GET_CLIENTS } from '@views/main/clients/requests';
import moment from 'moment';

const Clients = () => {
	const [clients, setClients] = useState([]);
	const [checked, setChecked] = useState(true);

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

	return (
		<Fragment>
			<Toolbar variant={'dense'} sx={{ mb: 2 }}>
				<NewClientDialog reloadClients={refetch} />
				<Button onClick={() => setChecked((prev) => !prev)}>clik</Button>

				<Button
					onClick={() => ref.current?.scrollIntoView({ behavior: 'smooth' })}
				>
					clik
				</Button>
			</Toolbar>

			<Grid container spacing={2}>
				<Grid item xs={12} md={8}>
					<Card>
						<CardHeader title='Clientes' subheader='Total' />
						<CardContent>
							<CustomDataGrid rows={clients} columns={headers} />
						</CardContent>
					</Card>
				</Grid>

				<Grid item xs={12} md={4}>
					<Collapse in={checked} collapsedSize={60}>
						<Card ref={ref}>
							<CardHeader
								title='Detalles'
								titleTypographyProps={{ align: 'center' }}
							/>
							<CardContent>
								<Avatar sx={{ width: 68, height: 68 }} />
							</CardContent>
						</Card>
					</Collapse>
					<Typography align={'center'}>Selecciona un cliente.</Typography>
				</Grid>
			</Grid>
		</Fragment>
	);
};

export default Clients;
