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
	Select,
	MenuItem,
	InputLabel,
	FormControl,
	TextField,
} from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useListPersistence } from './useListPersistence';
import toast from 'react-hot-toast';
import { reminderData } from '@views/main/reminders/ReminderData.js';
import AddIcon from '@mui/icons-material/Add';

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
	selectedView, // Añade esta prop
	setSelectedView,
}) => {
	// Estado local para controlar si los datos ya fueron inicializados
	const [isInitialized, setIsInitialized] = useState(false);
	const [openAddDialog, setOpenAddDialog] = useState(false);
	const [filteredListData, setFilteredListData] = useState([]); // Añade este estado
	const [newRecord, setNewRecord] = useState({
		fecha: new Date().toISOString().split('T')[0],
		seccion: 'HOY',
		FOLIO: '',
		SERVICIO: '',
		EMPRESA: '',
		CLIENTE: '',
		CONTACT: '',
	});

	// En handleAddRecord, actualiza el mapeo de secciones
	const sectionMapping = {
		HOY: 'hoy',
		VENCIDO: 'pasado',
		'POR VENCER': 'porVencer',
	};

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
				// Cargar datos iniciales una sola vez
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
	}, [isInitialized]);

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

	// 2. Efecto para mantener la sincronización entre vistas
	useEffect(() => {
		const syncViews = () => {
			try {
				const event = new CustomEvent('viewSync', {
					detail: {
						listData,
						columns,
					},
				});
				window.dispatchEvent(event);
				16;
			} catch (error) {
				console.error('Error al sincronizar vistas:', error);
			}
		};

		// Agregar un debounce para evitar actualizaciones frecuentes
		const timeoutId = setTimeout(syncViews, 500);
		return () => clearTimeout(timeoutId);
	}, [listData, columns]);

	// 3. Efecto para cargar datos al iniciar y manejar actualizaciones
	useEffect(() => {
		const handleStorageChange = (e) => {
			if (e.key === 'listData') {
				try {
					const newData = JSON.parse(e.newValue);
					if (newData) {
						setListData(newData);
					}
				} catch (error) {
					console.error('Error al procesar cambios del storage:', error);
				}
			}
		};

		// Escuchar cambios en el localStorage
		window.addEventListener('storage', handleStorageChange);

		return () => {
			window.removeEventListener('storage', handleStorageChange);
		};
	}, []);

	// 4. Efecto para manejar la persistencia de los datos editados
	useEffect(() => {
		if (!isInitialized) {
			return;
		}

		const persistEditedData = () => {
			try {
				const currentData = localStorage.getItem('listData');
				const parsedData = currentData ? JSON.parse(currentData) : [];

				// Verificar si hay cambios antes de actualizar
				if (JSON.stringify(parsedData) !== JSON.stringify(listData)) {
					localStorage.setItem('listData', JSON.stringify(listData));

					// Actualizar también el estado de las columnas del Kanban
					const updatedColumns = { ...columns };
					listData.forEach((group) => {
						group.LIST.forEach((item) => {
							Object.keys(updatedColumns).forEach((columnId) => {
								updatedColumns[columnId] = updatedColumns[columnId].map(
									(kanbanItem) =>
										kanbanItem.id === item.id
											? {
													...kanbanItem,
													title: item.SERVICIO,
													description: `${item.FECHA} - ${item.HORA || ''}`,
											  }
											: kanbanItem
								);
							});
						});
					});

					setColumns(updatedColumns); // Esta línea causa el ciclo
					localStorage.setItem('kanbanColumns', JSON.stringify(updatedColumns));
				}
			} catch (error) {
				console.error('Error al persistir datos editados:', error);
			}
		};

		persistEditedData();
	}, [listData, isInitialized]); // Elimina columns de las dependencias

	useEffect(() => {
		const filterDataBySection = () => {
			// Si no hay datos, retornar array vacío
			if (!listData || listData.length === 0) {
				return [];
			}

			// Si no hay vista seleccionada, mostrar todos los datos
			if (!selectedView) {
				return listData;
			}

			// Convertir la fecha actual a formato yyyy/mm/dd para comparación
			const today = new Date();
			const todayFormatted = today
				.toISOString()
				.split('T')[0]
				.replace(/-/g, '/');

			return listData.filter((group) => {
				// Convertir la fecha del grupo al mismo formato para comparación
				const groupDate = group.FECHA.split('/').reverse().join('/');

				switch (selectedView.toLowerCase()) {
					case 'hoy':
						return groupDate === todayFormatted;
					case 'pasado':
						return new Date(groupDate) < new Date(todayFormatted);
					case 'porvencer':
						return new Date(groupDate) > new Date(todayFormatted);
					default:
						// Si la vista no coincide con ninguna opción, mostrar todos
						return true;
				}
			});
		};

		// Aplicar el filtro y actualizar el estado
		const filtered = filterDataBySection();
		console.log('Vista seleccionada:', selectedView);
		console.log('Datos filtrados:', filtered);
		console.log('Datos originales:', listData);

		// Si no hay datos filtrados o no hay vista seleccionada, mostrar todos los datos
		setFilteredListData(filtered.length > 0 ? filtered : listData);
	}, [listData, selectedView]);

	const getNextId = useCallback(() => {
		let maxId = 0;
		listData.forEach((group) => {
			group.LIST.forEach((item) => {
				const currentId = parseInt(item.id);
				if (currentId > maxId) maxId = currentId;
			});
		});
		return (maxId + 1).toString();
	}, [listData]);

	const handleAddRecord = () => {
		try {
			// Validar los campos requeridos
			if (!newRecord.FOLIO || !newRecord.SERVICIO) {
				toast.error('Por favor complete los campos requeridos');
				return;
			}

			// Obtener la fecha actual en formato correcto
			const currentDate = new Date(newRecord.fecha);
			const formattedDate = `${currentDate
				.getDate()
				.toString()
				.padStart(2, '0')}/${(currentDate.getMonth() + 1)
				.toString()
				.padStart(2, '0')}/${currentDate.getFullYear()}`;

			// Crear el nuevo recordatorio con la estructura correcta
			const recordToAdd = {
				id: Date.now().toString(),
				FOLIO: newRecord.FOLIO,
				SERVICIO: newRecord.SERVICIO,
				EMPRESA: newRecord.EMPRESA,
				CLIENTE: newRecord.CLIENTE,
				CONTACT: newRecord.CONTACT,
				HORA: newRecord.HORA || '',
				FECHA: formattedDate,
				type: 'lead',
				seccion: newRecord.seccion,
			};

			// Actualizar listData con la estructura correcta
			setListData((prevData) => {
				// Buscar si ya existe un grupo con la misma fecha
				const existingGroupIndex = prevData.findIndex(
					(group) => group.FECHA === formattedDate
				);

				if (existingGroupIndex !== -1) {
					// Si existe el grupo, añadir el registro a su LIST
					const newData = [...prevData];
					newData[existingGroupIndex] = {
						...newData[existingGroupIndex],
						LIST: [...newData[existingGroupIndex].LIST, recordToAdd],
					};
					return newData;
				} else {
					// Si no existe el grupo, crear uno nuevo
					return [
						...prevData,
						{
							FECHA: formattedDate,
							LIST: [recordToAdd],
						},
					];
				}
			});

			// También actualizar las columnas del Kanban
			setColumns((prevColumns) => {
				const newColumns = { ...prevColumns };
				newColumns[recordToAdd.seccion] = [
					...newColumns[recordToAdd.seccion],
					{
						id: recordToAdd.id,
						title: recordToAdd.SERVICIO,
						description: `${recordToAdd.FECHA} - ${recordToAdd.HORA || ''}`,
						...recordToAdd,
					},
				];
				return newColumns;
			});

			// Actualizar la vista según la sección seleccionada
			const viewMapping = {
				VENCIDO: 'pasado',
				HOY: 'hoy',
				'POR VENCER': 'porVencer',
			};
			setSelectedView(viewMapping[recordToAdd.seccion]);

			// Limpiar el formulario y cerrar el diálogo
			setNewRecord({
				fecha: new Date().toISOString().split('T')[0],
				seccion: 'HOY',
				FOLIO: '',
				SERVICIO: '',
				EMPRESA: '',
				CLIENTE: '',
				CONTACT: '',
				HORA: '',
			});
			setOpenAddDialog(false);

			toast.success('✔️ Recordatorio agregado exitosamente');
		} catch (error) {
			console.error('Error al agregar el recordatorio:', error);
			toast.error('Error al agregar el recordatorio');
		}
	};

	return (
		<>
			{/* Agregar el botón de reseteo en la parte superior */}
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					mb: 2,
				}}
			>
				<Typography variant='h6'>Lista de Recordatorios</Typography>
				<Button
					variant='contained'
					color='primary'
					onClick={() => setOpenAddDialog(true)}
					startIcon={<AddIcon />}
				>
					Nuevo Recordatorio
				</Button>
			</Box>

			<Grid container spacing={20} sx={{ flexDirection: 'column-reverse' }}>
				{!filteredListData || filteredListData.length === 0 ? (
					<NoDataMessage />
				) : (
					filteredListData.map((item, index) => (
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

			<Dialog
				open={openAddDialog}
				onClose={() => setOpenAddDialog(false)}
				maxWidth='md'
				fullWidth
			>
				<DialogTitle>Nuevo Recordatorio</DialogTitle>
				<DialogContent>
					<Grid container spacing={3} sx={{ mt: 1 }}>
						<Grid item xs={12} sm={6}>
							<TextField
								type='date'
								label='Fecha'
								value={newRecord.fecha}
								onChange={(e) => {
									const newDate = e.target.value;
									const today = new Date().toISOString().split('T')[0];

									// Determinar sección automáticamente basada en la fecha
									let calculatedSection;
									if (newDate === today) {
										calculatedSection = 'HOY';
									} else if (newDate < today) {
										calculatedSection = 'VENCIDO';
									} else {
										calculatedSection = 'POR VENCER';
									}

									setNewRecord((prev) => ({
										...prev,
										fecha: newDate,
										seccion: calculatedSection,
									}));
								}}
								fullWidth
								InputLabelProps={{
									shrink: true,
								}}
							/>
						</Grid>

						{/* Campo de sección */}
						<Grid item xs={12} sm={6}>
							<FormControl fullWidth sx={{ mt: 2 }}>
								<InputLabel>Sección</InputLabel>
								<Select
									value={newRecord.seccion}
									onChange={(e) =>
										setNewRecord((prev) => ({
											...prev,
											seccion: e.target.value,
										}))
									}
								>
									<MenuItem value='VENCIDO'>Vencido</MenuItem>
									<MenuItem value='HOY'>Hoy</MenuItem>
									<MenuItem value='POR VENCER'>Por Vencer</MenuItem>
								</Select>
							</FormControl>
						</Grid>

						<Grid item xs={12}>
							<TextField
								fullWidth
								label='Folio'
								value={newRecord.FOLIO}
								onChange={(e) => {
									const value = e.target.value.toUpperCase();
									if (/^[A-Z0-9]*$/.test(value) && value.length <= 15) {
										setNewRecord((prev) => ({
											...prev,
											FOLIO: value,
										}));
									}
								}}
								required
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								fullWidth
								label='Servicio'
								value={newRecord.SERVICIO}
								onChange={(e) =>
									setNewRecord((prev) => ({
										...prev,
										SERVICIO: e.target.value,
									}))
								}
								required
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								fullWidth
								label='Empresa'
								value={newRecord.EMPRESA}
								onChange={(e) =>
									setNewRecord((prev) => ({
										...prev,
										EMPRESA: e.target.value,
									}))
								}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								fullWidth
								label='Cliente'
								value={newRecord.CLIENTE}
								onChange={(e) =>
									setNewRecord((prev) => ({
										...prev,
										CLIENTE: e.target.value,
									}))
								}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								fullWidth
								label='Contacto'
								value={newRecord.CONTACT}
								onChange={(e) =>
									setNewRecord((prev) => ({
										...prev,
										CONTACT: e.target.value,
									}))
								}
							/>
						</Grid>
					</Grid>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setOpenAddDialog(false)}>Cancelar</Button>
					<Button onClick={handleAddRecord} variant='contained' color='primary'>
						Agregar
					</Button>
				</DialogActions>
			</Dialog>

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
