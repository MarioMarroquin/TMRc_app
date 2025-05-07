import React from 'react';
import {
	Grid,
	Paper,
	Button,
	Typography,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Box,
	Fade,
} from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const formatearFecha = (fechaStr) => {
	if (!fechaStr) return 'N/A';
	const [año, mes, dia] = fechaStr.split('/');
	return `${dia}/${mes}/${año}`;
};

const ListReminder = ({
	listData,
	setListData,
	completedList,
	setCompletedList,
	ListoClick,
	handleDeleteClick,
	handleConfirmDelete,
	handleCancelDelete,
	openDialog,
	selectedItem,
	handleEditClick,
	openEditDialog,
	itemToEdit,
	setItemToEdit,
	handleCancelEdit,
	handleSaveEdit,
	handleMarkAsCompleted,
}) => {
	const NoDataMessage = () => (
		<Box
			sx={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				height: '50vh',
			}}
		>
			<Typography variant='h6' color='textSecondary' fontWeight='bold'>
				No hay recordatorios
			</Typography>
		</Box>
	);

	return (
		<>
			<Grid container spacing={20} sx={{ flexDirection: 'column-reverse' }}>
				{!listData || listData.length === 0 ? (
					<NoDataMessage />
				) : (
					listData.map((item, index) => (
						<Grid item xs={12} key={index}>
							<Paper elevation={3} sx={{ padding: '10px' }}>
								<Typography
									variant='h6'
									fontWeight='bold'
									sx={{ marginBottom: '10px' }}
								>
									{formatearFecha(item.FECHA)}
								</Typography>
								{item.LIST.map((subItem) => (
									<Paper
										key={subItem.id}
										sx={{
											padding: '15px',
											marginBottom: '10px',
											transition: 'transform 0.3s ease, box-shadow 0.3s ease',
											cursor: 'pointer',
											'&:hover': {
												transform: 'scale(1.015)',
												boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
											},
										}}
									>
										<Grid
											container
											spacing={4}
											alignItems='flex-start'
											gap='30px'
										>
											<Grid item>
												<Typography variant='body2' fontWeight='bold'>
													ID
												</Typography>
												<Typography variant='button'>{subItem.id}</Typography>
											</Grid>
											<Grid item>
												<Typography variant='body2' fontWeight='bold'>
													Folio
												</Typography>
												<Typography variant='button'>
													{subItem.FOLIO}
												</Typography>
											</Grid>
											<Grid item>
												<Typography variant='body2' fontWeight='bold'>
													Servicio
												</Typography>
												<Typography variant='button'>
													{subItem.SERVICIO}
												</Typography>
											</Grid>
											<Grid item>
												<Typography variant='body2' fontWeight='bold'>
													Empresa
												</Typography>
												<Typography variant='button'>
													{subItem.EMPRESA}
												</Typography>
											</Grid>
											<Grid item>
												<Typography variant='body2' fontWeight='bold'>
													Cliente
												</Typography>
												<Typography variant='button'>
													{subItem.CLIENTE}
												</Typography>
											</Grid>
											<Grid item>
												<Typography variant='body2' fontWeight='bold'>
													Contacto
												</Typography>
												<Typography variant='body1'>
													{subItem.CONTACT}
												</Typography>
											</Grid>
										</Grid>

										<Grid
											container
											spacing={1}
											sx={{ marginTop: '10px', justifyContent: 'flex-end' }}
										>
											<Grid item>
												<Button
													variant='contained'
													color='primary'
													size='small'
													startIcon={<EditIcon />}
													onClick={() => handleEditClick(subItem, item.FECHA)}
												>
													Editar
												</Button>
											</Grid>
											<Grid item>
												<Button
													variant='contained'
													color='secondary'
													size='small'
													onClick={() => handleDeleteClick(subItem)}
													startIcon={<DeleteIcon />}
												>
													Eliminar
												</Button>
											</Grid>
											<Grid item>
												<Button
													variant='contained'
													color='success'
													size='small'
													onClick={() => ListoClick(subItem, item.FECHA)}
													startIcon={<DoneIcon />}
												>
													Listo
												</Button>
											</Grid>
										</Grid>
									</Paper>
								))}
							</Paper>
						</Grid>
					))
				)}
			</Grid>

			<Dialog open={openDialog} onClose={handleCancelDelete}>
				<DialogTitle>¿Estás seguro?</DialogTitle>
				<DialogContent>¿Quieres eliminar este recordatorio?</DialogContent>
				<DialogActions>
					<Button onClick={handleCancelDelete}>Cancelar</Button>
					<Button onClick={handleConfirmDelete} color='error'>
						Eliminar
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default ListReminder;
