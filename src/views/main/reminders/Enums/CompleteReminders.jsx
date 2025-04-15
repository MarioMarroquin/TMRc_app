import React from 'react';
import { Box, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const formatFecha = (fecha) => {
	if (!fecha) return 'N/A';
	const [year, month, day] = fecha.split('/');
	return `${day}/${month}/${year}`;
};

const CompleteList = ({ CompleteList }) => {
	if (!CompleteList || CompleteList.length === 0) {
		return (
			<Box
				display='flex'
				justifyContent='center'
				alignItems='center'
				height='40vh'
			>
				<Typography variant='h6' color='textSecondary'>
					No hay recordatorios completados
				</Typography>
			</Box>
		);
	}

	// Configuración de columnas
	const columns = [
		{ field: 'id', headerName: 'ID', width: 100 },
		{ field: 'FOLIO', headerName: 'Folio', width: 130 },
		{ field: 'SERVICIO', headerName: 'Servicio', width: 180 },
		{ field: 'EMPRESA', headerName: 'Empresa', width: 180 },
		{ field: 'CLIENTE', headerName: 'Cliente', width: 180 },
		{
			field: 'FECHA',
			headerName: 'Completado',
			width: 150,
			valueFormatter: (params) => formatFecha(params.value),
		},
	];

	// Genera IDs únicos si no existen
	const rows = CompleteList.map((item, index) => ({
		...item,
		id: item.id || index,
	}));

	return (
		<Box sx={{ height: 570, width: '100%' }}>
			<DataGrid
				rows={rows}
				columns={columns}
				pageSize={7}
				rowsPerPageOptions={[7]}
				sx={{
					borderRadius: 2,
					boxShadow: 3,
					bgcolor: '#fafafa',
				}}
			/>
		</Box>
	);
};

export default CompleteList;
