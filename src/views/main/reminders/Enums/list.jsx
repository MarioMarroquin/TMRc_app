import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import toast from 'react-hot-toast';

const formatearFecha = (fechaStr) => {
	if (!fechaStr) return 'N/A';
	const [año, mes, dia] = fechaStr.split('/');
	return `${dia}/${mes}/${año}`;
};

const ListReminder = ({ data, CompletedList, setCompletedList }) => {
	const [listData, setListData] = useState(() => [...data]);
	const [openDialog, setOpenDialog] = useState(false);
	const [selectedItem, setSelectedItem] = useState(null);

	useEffect(() => {
		setListData([...data]);
	}, [data]);

	const ListoClick = (subItem, fechaGrupo) => {
		const updatedList = listData
			.map((group) => ({
				...group,
				LIST: group.LIST.filter((item) => item.id !== subItem.id),
			}))
			.filter((group) => group.LIST.length > 0);

		setListData(updatedList);

		// Agregar a la lista "Check"
		const itemConFecha = { ...subItem, FECHA: fechaGrupo };

		setCompletedList((prev) => [...prev, itemConFecha]);

		toast.success('¡Completado exitosamente!', { duration: 2500 });
	};

	const handleDeleteClick = (item) => {
		setSelectedItem(item);
		setOpenDialog(true);
	};

	const handleConfirmDelete = () => {
		if (selectedItem) {
			const updatedList = listData
				.map((group) => ({
					...group,
					LIST: group.LIST.filter((i) => i.id !== selectedItem.id),
				}))
				.filter((group) => group.LIST.length > 0);

			setListData(updatedList);
			toast.error('Eliminado correctamente', { duration: 3000 });
		}

		setSelectedItem(null);
		setOpenDialog(false);
	};

	const NoDataMessage = () => {
		return (
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'center', // Centrado horizontal
					alignItems: 'center', // Centrado vertical
					height: '50vh', // Ocupa toda la altura de la pantalla
				}}
			>
				<Typography variant='h6' color='textSecondary' fontWeight='bold'>
					No hay recordatorios
				</Typography>
			</Box>
		);
	};

	const handleCancelDelete = () => {
		setOpenDialog(false);
		setSelectedItem(null);
	};

	const sortedData = listData
		.map((item) => ({
			...item,
			LIST: item.LIST.sort((a, b) => new Date(b.FECHA) - new Date(a.FECHA)),
		}))
		.sort((a, b) => new Date(b.FECHA) - new Date(a.FECHA));

	return (
		<>
			<Grid container spacing={20} sx={{ flexDirection: 'column-reverse' }}>
				{listData.length === 0 ? (
					<NoDataMessage />
				) : (
					sortedData.map((item, index) => (
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
												<Typography variant='button' sx={{ fontWeight: 500 }}>
													{subItem.id}
												</Typography>
											</Grid>

											<Grid item>
												<Typography variant='body2' fontWeight='bold'>
													Folio
												</Typography>
												<Typography variant='button' sx={{ fontWeight: 500 }}>
													{subItem.FOLIO}
												</Typography>
											</Grid>

											<Grid item>
												<Typography variant='body2' fontWeight='bold'>
													Servicio
												</Typography>
												<Typography variant='button' sx={{ fontWeight: 500 }}>
													{subItem.SERVICIO}
												</Typography>
											</Grid>

											<Grid item>
												<Typography variant='body2' fontWeight='bold'>
													Empresa
												</Typography>
												<Typography variant='button' sx={{ fontWeight: 500 }}>
													{subItem.EMPRESA}
												</Typography>
											</Grid>

											<Grid item>
												<Typography variant='body2' fontWeight='bold'>
													Cliente
												</Typography>
												<Typography variant='button' sx={{ fontWeight: 500 }}>
													{subItem.CLIENTE}
												</Typography>
											</Grid>

											<Grid item>
												<Typography variant='body2' fontWeight='bold'>
													Contacto
												</Typography>
												<Typography variant='body1' sx={{ fontWeight: 500 }}>
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

			{/* Diálogo de confirmación */}
			<Dialog open={openDialog} onClose={handleCancelDelete}>
				<DialogTitle>¿Estás seguro de eliminarlo?</DialogTitle>
				<DialogContent>
					<Typography>
						Esta acción no se puede deshacer. ¿Deseas continuar?
					</Typography>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCancelDelete} color='inherit'>
						Cancelar
					</Button>
					<Button
						onClick={handleConfirmDelete}
						color='error'
						variant='contained'
					>
						Eliminar
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default ListReminder;
