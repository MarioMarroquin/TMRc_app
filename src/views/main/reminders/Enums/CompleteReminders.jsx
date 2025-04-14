import React from 'react';
import { Box, Paper, Typography, Grid } from '@mui/material';

const CompleteList = ({ CompleteList }) => {
	if (CompleteList.length === 0) {
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

	return (
		<Grid container spacing={2}>
			{CompleteList.map((item, index) => (
				<Grid item xs={12} key={index}>
					<Paper sx={{ p: 2 }}>
						<Typography variant='subtitle2' fontWeight='bold'>
							Fecha completado: {item.FECHA}
						</Typography>
						<Typography variant='body1'>ID: {item.id}</Typography>
						<Typography variant='body1'>Folio: {item.FOLIO}</Typography>
						<Typography variant='body1'>Servicio: {item.SERVICIO}</Typography>
						<Typography variant='body1'>Empresa: {item.EMPRESA}</Typography>
						<Typography variant='body1'>Cliente: {item.CLIENTE}</Typography>
					</Paper>
				</Grid>
			))}
		</Grid>
	);
};

export default CompleteList;
