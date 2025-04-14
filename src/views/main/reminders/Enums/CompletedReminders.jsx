// CompletedReminders.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import PropTypes from 'prop-types';

const formatearFecha = (fechaStr) => {
	if (!fechaStr) return 'N/A';
	const [año, mes, dia] = fechaStr.split('/');
	return `${dia}/${mes}/${año}`;
};

const CompletedReminders = ({ CompletedList }) => {
	if (CompletedList.length === 0) {
		return (
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					height: '80vh',
				}}
			>
				<Typography variant='h6' fontWeight='bold' color='text.secondary'>
					No hay recordatorios completados
				</Typography>
			</Box>
		);
	}

	return (
		<Box sx={{ marginTop: 5 }}>
			<Typography variant='h6' fontWeight='bold' align='center' sx={{ mb: 3 }}>
				Recordatorios Completados
			</Typography>

			<Box
				sx={{
					height: 570,
					width: '100%',
					backgroundColor: 'white',
					borderRadius: 2,
					boxShadow: 2,
				}}
			>
				<DataGrid
					rows={CompletedList.map((item) => ({
						id: item.id,
						folio: item.FOLIO,
						servicio: item.SERVICIO,
						fecha: item.FECHA || 'N/A',
						empresa: item.EMPRESA,
						contacto: item.CONTACT,
					}))}
					columns={[
						{ field: 'id', headerName: 'ID', flex: 0.5 },
						{ field: 'folio', headerName: 'Folio', flex: 1 },
						{ field: 'servicio', headerName: 'Servicio', flex: 1 },
						{
							field: 'fecha',
							headerName: 'Fecha',
							flex: 1,
							sortable: true,
							valueGetter: (params) => params.row.fecha,
							renderCell: (params) => formatearFecha(params.value),
						},
						{ field: 'empresa', headerName: 'Empresa', flex: 1 },
						{ field: 'contacto', headerName: 'Contacto', flex: 1 },
					]}
					pageSize={5}
					rowsPerPageOptions={[5, 10, 25]}
					sx={{
						'& .MuiDataGrid-columnHeaders': {
							backgroundColor: '#D3D3D3',
							color: '#000000',
							fontWeight: 'bold',
						},
						'& .MuiDataGrid-row:hover': {
							backgroundColor: '#f5f5f5',
						},
					}}
				/>
			</Box>
		</Box>
	);
};

CompletedReminders.propTypes = {
	CompletedList: PropTypes.array.isRequired,
};

export default CompletedReminders;
