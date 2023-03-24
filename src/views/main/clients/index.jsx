import { Fragment, useState } from 'react';
import { Card, CardContent, CardHeader } from '@mui/material';
import Chart from 'react-apexcharts';
import CustomDataGrid from '@components/customDataGrid';

const Clients = () => {
	const headers = [
		{
			field: 'createdAt',
			headerName: 'Fecha',
			headerAlign: 'center',
			align: 'center',
			width: 200,
			valueFormatter: (params) => {
				const date = new Date(params.value);
				const formattedDate = moment(date).format('DD/MM/YYYY hh:mm a');

				return formattedDate;
			},
		},
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
					return (
						params.row.user.firstName + ' ' + params.row.user.firstLastName
					);
				}
			},
		},
		{
			field: 'method',
			headerName: 'Canal',
			headerAlign: 'center',
			align: 'center',
			width: 150,
			valueFormatter: (params) => {
				if (params.value === 'DEPOSIT') {
					return 'Deposito';
				}
				return 'Tarjeta';
			},
		},
		{
			field: 'status',
			headerName: 'Status',
			headerAlign: 'center',
			align: 'center',
			width: 200,
			valueFormatter: (params) => {
				if (params.value === 'SUCCEEDED') {
					return 'Exitoso';
				}
				if (params.value === 'FAILED') {
					return 'Fallido';
				}
				if (params.value === 'PROCESSING') {
					return 'En proceso';
				}

				return 'Inicializado';
			},
		},
		{
			field: 'amount',
			headerName: 'Monto ($)',
			headerAlign: 'center',
			align: 'center',
			width: 150,
			valueFormatter: (params) => {
				const aux = params.value;

				return aux.toLocaleString('en-US', {
					style: 'currency',
					currency: 'USD',
				});
			},
		},
	];

	return (
		<Fragment>
			<Card>
				<CardHeader title='Clientes' subheader='Total' />
				<CardContent>
					<CustomDataGrid rows={[]} columns={headers} />
				</CardContent>
			</Card>
		</Fragment>
	);
};

export default Clients;
