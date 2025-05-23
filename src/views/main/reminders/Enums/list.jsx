import { useEffect, useMemo, useCallback, useState } from 'react';
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
	Tooltip,
} from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useListPersistence } from './useListPersistence';
import toast from 'react-hot-toast';
import { reminderData } from '@views/main/reminders/ReminderData.js';

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
	deletedItems = [],
	setDeletedItems,
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
	columns,
	setColumns,
}) => {
	// Estado local para controlar si los datos ya fueron inicializados
	const [isInitialized, setIsInitialized] = useState(false);

	// Función para resetear datos
	const resetListData = useCallback(() => {
		try {
			if (
				window.confirm(
					'¿Estás seguro de que quieres resetear todos los datos? Esta acción no se puede deshacer.'
				)
			) {
				// Resetear estados
				setListData(reminderData);
				setCompletedList([]);
				if (typeof setDeletedItems === 'function') {
					setDeletedItems([]);
				}

				// Limpiar localStorage
				localStorage.clear(); // Limpia

				toast.success('✔️ Datos restablecidos correctamente');
			}
		} catch (error) {
			console.error('Error al resetear datos:', error);
			toast.error('Error al resetear los datos');
		}
	}, [setListData, setCompletedList, setDeletedItems]);

	const filteredData = useMemo(() => {
		if (!listData) return [];
		return [...listData].sort((a, b) => {
			const dateA = new Date(a.FECHA.replace(/\//g, '-'));
			const dateB = new Date(b.FECHA.replace(/\//g, '-'));
			return dateA - dateB;
		});
	}, [listData]);

	// Remover cualquier useEffect que esté causando el ciclo infinito
	useEffect(() => {
		const handleListDataUpdate = () => {
			const storedData = localStorage.getItem('listData');
			if (storedData) {
				try {
					setListData(JSON.parse(storedData));
				} catch (error) {
					console.error('Error parsing listData:', error);
				}
			}
		};

		window.addEventListener('listDataUpdate', handleListDataUpdate);
		return () => {
			window.removeEventListener('listDataUpdate', handleListDataUpdate);
		};
	}, []); // Solo se ejecuta una vez al montar el componente

	const { updateListData, updateCompletedList } = useListPersistence(
		listData,
		setListData,
		completedList,
		setCompletedList
	);

	const handleComplete = (item) => {
		try {
			// 1. Eliminar de listData
			const newListData = listData
				.map((group) => ({
					...group,
					LIST: group.LIST.filter((listItem) => listItem.id !== item.id),
				}))
				.filter((group) => group.LIST.length > 0);

			// 2. Crear el item completado
			const completedItem = {
				...item,
				completedDate: new Date().toISOString(),
			};

			// 3. Añadir a completedList
			setCompletedList((prev) => [...prev, completedItem]);

			// 4. Actualizar el estado
			updateListData(newListData);

			// 5. Actualizar Kanban
			setColumns((prevColumns) => {
				const newColumns = { ...prevColumns };
				Object.keys(newColumns).forEach((columnId) => {
					newColumns[columnId] = newColumns[columnId].filter(
						(kanbanItem) => kanbanItem.id !== item.id
					);
				});
				return newColumns;
			});

			toast.success('✔️ Recordatorio completado');
		} catch (error) {
			console.error('Error al completar el recordatorio:', error);
			toast.error('Error al completar el recordatorio');
		}
	};

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

	useEffect(() => {
		if (!isInitialized) {
			try {
				const storedListData = localStorage.getItem('listData');
				const storedCompletedList = localStorage.getItem('completedList');
				const storedDeletedItems = localStorage.getItem('deletedItems');

				if (storedListData) {
					setListData(JSON.parse(storedListData));
				}
				if (storedCompletedList) {
					setCompletedList(JSON.parse(storedCompletedList));
				}
				if (storedDeletedItems && typeof setDeletedItems === 'function') {
					setDeletedItems(JSON.parse(storedDeletedItems));
				}
				setIsInitialized(true);
			} catch (error) {
				console.error('Error loading initial data:', error);
			}
		}
	}, [isInitialized, setListData, setCompletedList, setDeletedItems]);

	useEffect(() => {
		if (isInitialized) {
			try {
				localStorage.setItem('listData', JSON.stringify(listData));
				localStorage.setItem('completedList', JSON.stringify(completedList));
				if (deletedItems) {
					localStorage.setItem('deletedItems', JSON.stringify(deletedItems));
				}
			} catch (error) {
				console.error('Error saving data:', error);
			}
		}
	}, [isInitialized, listData, completedList, deletedItems]);

	return (
		<>
			{/* Agregar el botón de reseteo en la parte superior */}
			<Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
				<Typography variant='h6'>Lista de Recordatorios</Typography>
			</Box>

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
									<Tooltip title='Doble clic para editar' arrow>
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
											onDoubleClick={() => {
												// Aquí configuramos el itemToEdit con todos los datos necesarios
												const editData = {
													...subItem,
													FECHA: item.FECHA,
												};
												handleEditClick(editData, item.FECHA);
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
									</Tooltip>
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
