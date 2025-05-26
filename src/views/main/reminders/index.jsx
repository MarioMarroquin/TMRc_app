import { useState, useEffect } from 'react';
import {
	Button,
	Container,
	FormControl,
	FormControlLabel,
	Grid,
	Radio,
	RadioGroup,
	Stack,
	Switch,
	Typography,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	DialogContentText,
	Fade,
} from '@mui/material';
import PlaylistAddCheckCircleIcon from '@mui/icons-material/PlaylistAddCheckCircle';
import ViewWeekIcon from '@mui/icons-material/ViewWeek';
import ListReminder from '@views/main/reminders/Enums/list.jsx';
import Kanban from '@views/main/reminders/Enums/Kanban.jsx';
import CompleteList from './Enums/CompleteReminders.jsx';
import { reminderData } from './ReminderData.js';
import ButtonAddReminder from '@views/main/reminders/Enums/ButtonAddReminder.jsx';
import { useReminders } from '@views/main/reminders/useReminders.js';
import toast, { Toaster } from 'react-hot-toast';

const Reminders = () => {
	const {
		listData,
		setListData,
		completedList,
		setCompletedList,
		ListoClick,
		handleDeleteClick,
		handleCancelDelete,
		openDialog,
		selectedItem,
		selectedView,
		setSelectedView,
		handleEditClick,
		handleSaveEdit,
		handleCancelEdit,
		openEditDialog,
		itemToEdit,
		setItemToEdit,
		handleDeleteAll,
		handleUndoCompleted,
		handleDeleteCompletedClick,
		handleConfirmCompletedDelete,
		handleCancelCompletedDelete,
		openCompletedDeleteDialog,
		selectedCompletedItem,
		handleConfirmDelete,
		openDeleteAllDialog,
		handleOpenDeleteAllDialog,
		handleCloseDeleteAllDialog,
		handleMarkAsCompleted,
	} = useReminders();

	const [columns, setColumns] = useState(() => {
		const saved = localStorage.getItem('kanbanColumns');
		return saved
			? JSON.parse(saved)
			: {
					VENCIDO: [],
					HOY: [],
					'POR VENCER': [],
			  };
	});

	useEffect(() => {
		const handleListDataUpdate = (event) => {
			if (event.detail) {
				setListData(event.detail);
			}
		};

		const handleKanbanUpdate = (event) => {
			if (event.detail) {
				setColumns(event.detail);
			}
		};

		window.addEventListener('listDataUpdate', handleListDataUpdate);
		window.addEventListener('kanbanUpdate', handleKanbanUpdate);

		return () => {
			window.removeEventListener('listDataUpdate', handleListDataUpdate);
			window.removeEventListener('kanbanUpdate', handleKanbanUpdate);
		};
	}, []);

	const [showList, setShowList] = useState(
		!!JSON.parse(localStorage.getItem('showList')) || false
	);

	useEffect(() => {
		localStorage.setItem('showList', JSON.stringify(showList));
	}, [showList]);

	useEffect(() => {
		const storedListData = JSON.parse(localStorage.getItem('listData')) || [];
		const storedCompleted =
			JSON.parse(localStorage.getItem('completedList')) || [];

		setListData(storedListData);
		setCompletedList(storedCompleted);
	}, []);

	useEffect(() => {
		localStorage.setItem('listData', JSON.stringify(listData));
		localStorage.setItem('completedList', JSON.stringify(completedList));
	}, [listData, completedList]);

	const filteredListData = Array.isArray(listData)
		? listData
				.filter((group) => group.LIST && group.LIST.length > 0)
				.sort((a, b) => new Date(a.FECHA) - new Date(b.FECHA))
		: [];

	const [lastListView, setLastListView] = useState('hoy');

	useEffect(() => {
		if (showList) {
			setLastListView(selectedView); // Guarda el último selectedView válido de la lista
		}
	}, [selectedView, showList]);

	const [deletedItems, setDeletedItems] = useState(() => {
		const stored = localStorage.getItem('deletedItems');
		return stored ? JSON.parse(stored) : [];
	});

	useEffect(() => {
		localStorage.setItem('deletedItems', JSON.stringify(deletedItems));
	}, [deletedItems]);

	useEffect(() => {
		if (listData) {
			const filteredData = listData
				.map((group) => ({
					...group,
					LIST: group.LIST.filter((item) => !deletedItems.includes(item.id)),
				}))
				.filter((group) => group.LIST.length > 0);

			setListData(filteredData);
		}
	}, [showList]);

	useEffect(() => {
		const initializeData = () => {
			try {
				const savedColumns = localStorage.getItem('kanbanColumns');
				if (!savedColumns) {
					const defaultData = transformReminderDataToKanban();
					localStorage.setItem('kanbanColumns', JSON.stringify(defaultData));
				}
			} catch (error) {
				console.error('Error initializing data:', error);
			}
		};

		initializeData();
	}, []);

	return (
		<Container sx={{ paddingTop: '5px' }}>
			<Grid
				container
				alignItems='center'
				justifyContent='space-between'
				sx={{ mb: 2 }}
			>
				<Grid item>{showList && <ButtonAddReminder />}</Grid>

				<Grid item>
					{showList && (
						<FormControl component='fieldset'>
							<RadioGroup
								row
								aria-label='vista'
								name='selectedView'
								value={selectedView}
								onChange={(e) => setSelectedView(e.target.value)}
							>
								<FormControlLabel
									value='pasado'
									control={<Radio />}
									label='Vencido'
								/>
								<FormControlLabel value='hoy' control={<Radio />} label='Hoy' />
								<FormControlLabel
									value='porVencer'
									control={<Radio />}
									label='Por Vencer'
								/>

								<FormControlLabel
									value='Listo'
									control={<Radio />}
									label='Listo'
								/>
							</RadioGroup>
						</FormControl>
					)}
				</Grid>

				<Grid item>
					<Stack direction='row' alignItems='center' spacing={1}>
						<Typography variant='button' fontWeight='bold'>
							Kanban
						</Typography>
						<ViewWeekIcon />
						<Switch
							checked={showList}
							onChange={(event) => {
								const checked = event.target.checked;

								if (!checked && selectedView === 'Listo') {
									setSelectedView('hoy');
								}

								if (checked) {
									setSelectedView(lastListView || 'hoy');
								}

								setShowList(checked);
							}}
						/>
						<PlaylistAddCheckCircleIcon />
						<Typography variant='button' fontWeight='bold'>
							Lista
						</Typography>
					</Stack>
				</Grid>
			</Grid>

			<Fade
				in={showList && selectedView === 'Listo'}
				timeout={200}
				unmountOnExit
			>
				<div style={{ textAlign: 'center' }}>
					<CompleteList
						completedList={completedList}
						setCompletedList={setCompletedList}
						handleUndoCompleted={handleUndoCompleted}
						handleDeleteCompletedClick={handleDeleteCompletedClick}
						handleConfirmCompletedDelete={handleConfirmCompletedDelete}
						handleCancelCompletedDelete={handleCancelCompletedDelete}
						openCompletedDeleteDialog={openCompletedDeleteDialog}
						selectedCompletedItem={selectedCompletedItem}
						columns={columns}
						setColumns={setColumns}
						listData={listData} // Agregar esta prop
						setListData={setListData}
					/>
					{completedList.length > 0 && (
						<Button
							variant='contained'
							color='error'
							onClick={handleOpenDeleteAllDialog}
							size='small'
							sx={{
								mt: 2,
								padding: '4px 12px',
								fontSize: '0.75rem',
								mx: 'auto',
								display: 'block',
							}}
						>
							Eliminar Todos
						</Button>
					)}
				</div>
			</Fade>

			<Fade
				in={showList && selectedView !== 'Listo'}
				timeout={200}
				unmountOnExit
			>
				<div>
					<ListReminder
						listData={filteredListData}
						setListData={setListData}
						completedList={completedList}
						setCompletedList={setCompletedList}
						ListoClick={handleMarkAsCompleted}
						handleDeleteClick={handleDeleteClick}
						handleConfirmDelete={handleConfirmDelete}
						handleCancelDelete={handleCancelDelete}
						openDialog={openDialog}
						openEditDialog={openEditDialog}
						selectedItem={selectedItem}
						handleEditClick={handleEditClick}
						handleSaveEdit={handleSaveEdit}
						handleCancelEdit={handleCancelEdit}
						itemToEdit={itemToEdit}
						setItemToEdit={setItemToEdit}
						deletedItems={deletedItems}
						setDeletedItems={setDeletedItems}
						columns={columns}
						setColumns={setColumns}
					/>
				</div>
			</Fade>
			<Fade in={!showList} timeout={150} unmountOnExit>
				<div>
					<Kanban
						handleMarkAsCompleted={handleMarkAsCompleted}
						setListData={setListData}
						setDeletedItems={setDeletedItems}
						deletedItems={deletedItems}
						setCompletedList={setCompletedList}
						completedList={completedList}
						selectedView={selectedView}
						columns={columns} // Asegúrate de pasar columns
						setColumns={setColumns} // Asegúrate de pasar setColumns
					/>
				</div>
			</Fade>

			<Dialog
				open={openEditDialog}
				onClose={handleCancelEdit}
				maxWidth='sm'
				fullWidth
			>
				<DialogTitle sx={{ mb: 3 }}>Editar Recordatorio</DialogTitle>
				<DialogContent>
					<Grid container spacing={3}>
						{/* Folio */}
						<Grid item xs={12} sm={6}>
							<Typography variant='body2' fontWeight='bold' sx={{ mb: 1 }}>
								Folio
							</Typography>
							<TextField
								placeholder='Folio'
								variant='outlined'
								fullWidth
								required
								value={itemToEdit?.FOLIO || ''}
								onChange={(e) => {
									const value = e.target.value;
									const isValid = /^[A-Za-z0-9-]+$/.test(value);
									setItemToEdit((prev) => ({
										...prev,
										FOLIO: value,
										folioError:
											value.trim() === ''
												? 'El folio es requerido'
												: !isValid
												? 'Solo letras, números y guiones permitidos'
												: '',
									}));
								}}
								error={!!itemToEdit?.folioError}
								helperText={itemToEdit?.folioError}
								sx={{
									'& .MuiOutlinedInput-root': {
										borderRadius: '10px',
										paddingRight: '5px',
									},
									'& .MuiInputBase-input': {
										padding: '10px 14px',
									},
								}}
							/>
						</Grid>

						{/* Servicio */}
						<Grid item xs={12} sm={6}>
							<Typography variant='body2' fontWeight='bold' sx={{ mb: 1 }}>
								Servicio
							</Typography>
							<TextField
								placeholder='Servicio'
								variant='outlined'
								fullWidth
								required
								value={itemToEdit?.SERVICIO || ''}
								onChange={(e) => {
									const value = e.target.value;
									setItemToEdit((prev) => ({
										...prev,
										SERVICIO: value,
										servicioError:
											value.trim() === ''
												? 'El servicio es requerido'
												: value.length > 100
												? 'Máximo 100 caracteres'
												: '',
									}));
								}}
								error={!!itemToEdit?.servicioError}
								helperText={
									itemToEdit?.servicioError ||
									`${(itemToEdit?.SERVICIO || '').length}/100`
								}
								sx={{
									'& .MuiOutlinedInput-root': {
										borderRadius: '10px',
										paddingRight: '5px',
									},
									'& .MuiInputBase-input': {
										padding: '10px 14px',
									},
								}}
							/>
						</Grid>

						{/* Empresa */}
						<Grid item xs={12} sm={6}>
							<Typography variant='body2' fontWeight='bold' sx={{ mb: 1 }}>
								Empresa
							</Typography>
							<TextField
								placeholder='Empresa'
								variant='outlined'
								fullWidth
								required
								value={itemToEdit?.EMPRESA || ''}
								onChange={(e) => {
									const value = e.target.value;
									setItemToEdit((prev) => ({
										...prev,
										EMPRESA: value,
										empresaError:
											value.trim() === ''
												? 'La empresa es requerida'
												: value.length > 150
												? 'Máximo 150 caracteres'
												: '',
									}));
								}}
								error={!!itemToEdit?.empresaError}
								helperText={
									itemToEdit?.empresaError ||
									`${(itemToEdit?.EMPRESA || '').length}/150`
								}
								sx={{
									'& .MuiOutlinedInput-root': {
										borderRadius: '10px',
										paddingRight: '5px',
									},
									'& .MuiInputBase-input': {
										padding: '10px 14px',
									},
								}}
							/>
						</Grid>

						{/* Cliente */}
						<Grid item xs={12} sm={6}>
							<Typography variant='body2' fontWeight='bold' sx={{ mb: 1 }}>
								Cliente
							</Typography>
							<TextField
								placeholder='Cliente'
								variant='outlined'
								fullWidth
								required
								value={itemToEdit?.CLIENTE || ''}
								onChange={(e) => {
									const value = e.target.value;
									const isValid = /^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/.test(value);
									setItemToEdit((prev) => ({
										...prev,
										CLIENTE: value,
										clienteError:
											value.trim() === ''
												? 'El cliente es requerido'
												: !isValid
												? 'Solo letras y espacios permitidos'
												: value.length > 100
												? 'Máximo 100 caracteres'
												: '',
									}));
								}}
								error={!!itemToEdit?.clienteError}
								helperText={
									itemToEdit?.clienteError ||
									`${(itemToEdit?.CLIENTE || '').length}/100`
								}
								sx={{
									'& .MuiOutlinedInput-root': {
										borderRadius: '10px',
										paddingRight: '5px',
									},
									'& .MuiInputBase-input': {
										padding: '10px 14px',
									},
								}}
							/>
						</Grid>

						{/* Contacto */}
						<Grid item xs={12}>
							<Typography variant='body2' fontWeight='bold' sx={{ mb: 1 }}>
								Contacto
							</Typography>
							<TextField
								placeholder='Contacto'
								variant='outlined'
								fullWidth
								required
								multiline
								rows={2}
								value={itemToEdit?.CONTACT || ''}
								onChange={(e) => {
									const value = e.target.value;
									setItemToEdit((prev) => ({
										...prev,
										CONTACT: value,
										contactError:
											value.trim() === ''
												? 'El contacto es requerido'
												: value.length > 200
												? 'Máximo 200 caracteres'
												: !value.includes('@') && value.trim() !== ''
												? 'Debe incluir un correo electrónico'
												: '',
									}));
								}}
								error={!!itemToEdit?.contactError}
								helperText={
									itemToEdit?.contactError ||
									`${(itemToEdit?.CONTACT || '').length}/200`
								}
								sx={{
									'& .MuiOutlinedInput-root': {
										borderRadius: '10px',
										paddingRight: '5px',
									},
								}}
							/>
						</Grid>
					</Grid>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={() => {
							// Restaurar valores originales al cancelar
							setItemToEdit(selectedItem);
							handleCancelEdit();
						}}
						color='inherit'
					>
						Cancelar
					</Button>

					<Button
						onClick={() => {
							// Validaciones antes de guardar
							const errors = [];

							if (!itemToEdit?.FOLIO?.trim()) {
								errors.push('El folio es requerido');
							}

							if (!itemToEdit?.SERVICIO?.trim()) {
								errors.push('El servicio es requerido');
							}

							if (!itemToEdit?.EMPRESA?.trim()) {
								errors.push('La empresa es requerida');
							}

							if (!itemToEdit?.CLIENTE?.trim()) {
								errors.push('El cliente es requerido');
							}

							if (!itemToEdit?.CONTACT?.trim()) {
								errors.push('El contacto es requerido');
							}

							// Validaciones específicas
							if (!/^[A-Za-z0-9-]+$/.test(itemToEdit?.FOLIO || '')) {
								errors.push(
									'El folio solo puede contener letras, números y guiones'
								);
							}

							if ((itemToEdit?.SERVICIO || '').length > 100) {
								errors.push('El servicio no puede exceder los 100 caracteres');
							}

							if ((itemToEdit?.EMPRESA || '').length > 150) {
								errors.push('La empresa no puede exceder los 150 caracteres');
							}

							if (
								!/^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/.test(itemToEdit?.CLIENTE || '')
							) {
								errors.push('El cliente solo puede contener letras y espacios');
							}

							if (
								!itemToEdit?.CONTACT?.includes('@') &&
								itemToEdit?.CONTACT?.trim() !== ''
							) {
								errors.push('El contacto debe incluir un correo electrónico');
							}

							if (errors.length > 0) {
								errors.forEach((error) => toast.error(error));
								return;
							}

							// Si todas las validaciones pasan, proceder con el guardado
							handleSaveEdit(itemToEdit);
						}}
						variant='contained'
						color='primary'
					>
						Guardar
					</Button>
				</DialogActions>
			</Dialog>

			<Dialog open={openDeleteAllDialog} onClose={handleCloseDeleteAllDialog}>
				<DialogTitle>
					¿Eliminar todos los recordatorios completados?
				</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Esta acción eliminará todos los recordatorios completados de forma
						permanente. ¿Estás seguro?
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseDeleteAllDialog}>Cancelar</Button>
					<Button
						onClick={() => {
							handleDeleteAll();
							handleCloseDeleteAllDialog();
						}}
						variant='contained'
						color='error'
					>
						Sí, eliminar todos
					</Button>
				</DialogActions>
			</Dialog>
		</Container>
	);
};

export default Reminders;
