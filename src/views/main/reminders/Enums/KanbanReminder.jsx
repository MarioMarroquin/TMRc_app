import { Card, CardContent, Typography, Box } from '@mui/material';

const KanbanReminder = ({ folio, servicio, fecha }) => {
	return (
		<Card
			sx={{
				display: 'flex',
				padding: 8,
				mx: 10,
				my: 5,
				transition: 'transform 0.2s ease-in-out',
				'&:hover': {
					transform: 'scale(1.03)',
					cursor: 'grab',
				},
			}}
		>
			<CardContent>
				{/* FOLIO */}
				<Box display='flex' alignItems='center' mb={2} gap={2}>
					<Typography variant='body1' fontWeight='bold'>
						Folio:
					</Typography>
					<Typography
						variant='body2'
						fontWeight='normal'
						color='text.secondary'
						sx={{ letterSpacing: '0.5px', ml: 5 }}
					>
						{folio}
					</Typography>
				</Box>

				{/* SERVICIO con ícono y color personalizado */}
				<Box
					px={1.8}
					py={0.8}
					mb={2}
					display='inline-flex'
					alignItems='center'
					gap={1}
					borderRadius={2}
				>
					<Typography
						variant='body2'
						fontWeight='medium'
						color={
							servicio === 'RENTA'
								? '#1976D2'
								: servicio === 'VENTA'
								? '#2E7D32'
								: '#EF6C00'
						}
					></Typography>
					<Typography
						variant='body2'
						fontWeight='medium'
						color={
							servicio === 'RENTA'
								? '#1976D2'
								: servicio === 'VENTA'
								? '#2E7D32'
								: '#EF6C00'
						}
						sx={{ mt: 8 }}
					>
						{servicio}
					</Typography>
				</Box>

				{/* FECHA */}
				<Typography variant='body2' color='text.secondary' sx={{ mt: 10 }}>
					📅 {fecha}
				</Typography>
			</CardContent>
		</Card>
	);
};

export default KanbanReminder;
