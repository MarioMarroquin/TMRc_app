import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import PlaylistAddCheckCircleIcon from '@mui/icons-material/PlaylistAddCheckCircle';
import ViewWeekIcon from '@mui/icons-material/ViewWeek';

import ListReminder from '@views/main/reminders/Enums/list.jsx';
import Kanban from '@views/main/reminders/Enums/Kanban.jsx';
import CompleteList from './Enums/CompleteReminders.jsx';
import { reminderData } from './ReminderData.js';
import ButtonAddReminder from '@views/main/reminders/Enums/ButtonAddReminder.jsx';
import { useReminders } from '@views/main/reminders/useReminders.js';

const Reminders = () => {
	const {
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
		selectedView,
		setSelectedView,
		handleEditClick,
		handleSaveEdit,
		handleCancelEdit,
		openEditDialog,
		itemToEdit,
		setItemToEdit,
		handleDeleteAll,
	} = useReminders();

	const [showList, setShowList] = useState(
		!!JSON.parse(localStorage.getItem('showList')) || false
	);

	useEffect(() => {
		localStorage.setItem('showList', JSON.stringify(showList));
	}, [showList]);

	useEffect(() => {
		const storedListData = JSON.parse(localStorage.getItem('listData'));
		const storedCompletedList = JSON.parse(
			localStorage.getItem('completedList')
		);

		if (storedListData) {
			setListData(storedListData);
		}
		if (storedCompletedList) {
			setCompletedList(storedCompletedList);
		}
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
									label='Pasado'
								/>
								<FormControlLabel value='hoy' control={<Radio />} label='Hoy' />
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

			{selectedView === 'Listo' ? (
				<div>
					<CompleteList CompleteList={completedList} />
					<Button
						variant='contained'
						color='error'
						onClick={handleDeleteAll}
						size='small'
						sx={{
							mt: 2,
							padding: '4px 12px', // Ajusta el padding (espaciado interno)
							fontSize: '0.75rem', // Ajusta el tamaño de la fuente
						}}
					>
						Eliminar Todos
					</Button>
				</div>
			) : showList ? (
				<ListReminder
					listData={filteredListData}
					setListData={setListData}
					completedList={completedList}
					setCompletedList={setCompletedList}
					ListoClick={ListoClick}
					handleDeleteClick={handleDeleteClick}
					handleConfirmDelete={handleConfirmDelete}
					handleCancelDelete={handleCancelDelete}
					openDialog={openDialog}
					selectedItem={selectedItem}
					handleEditClick={handleEditClick}
				/>
			) : (
				<Kanban reminderData={reminderData} selectedView={selectedView} />
			)}

			<Dialog
				open={openEditDialog}
				onClose={handleCancelEdit}
				maxWidth='sm'
				fullWidth
			>
				<DialogTitle sx={{ mb: 3 }}>Editar Recordatorio</DialogTitle>

				<DialogContent>
					<Grid container spacing={3}>
						<Grid item xs={12} sm={6}>
							<Typography variant='body2' fontWeight='bold' sx={{ mb: 1 }}>
								Folio
							</Typography>
							<TextField
								placeholder='Folio'
								variant='outlined'
								fullWidth
								value={itemToEdit?.FOLIO || ''}
								onChange={(e) =>
									setItemToEdit({ ...itemToEdit, FOLIO: e.target.value })
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

						<Grid item xs={12} sm={6}>
							<Typography variant='body2' fontWeight='bold' sx={{ mb: 1 }}>
								Servicio
							</Typography>
							<TextField
								placeholder='Servicio'
								variant='outlined'
								fullWidth
								value={itemToEdit?.SERVICIO || ''}
								onChange={(e) =>
									setItemToEdit({ ...itemToEdit, SERVICIO: e.target.value })
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

						<Grid item xs={12} sm={6}>
							<Typography variant='body2' fontWeight='bold' sx={{ mb: 1 }}>
								Empresa
							</Typography>
							<TextField
								placeholder='Empresa'
								variant='outlined'
								fullWidth
								value={itemToEdit?.EMPRESA || ''}
								onChange={(e) =>
									setItemToEdit({ ...itemToEdit, EMPRESA: e.target.value })
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

						<Grid item xs={12} sm={6}>
							<Typography variant='body2' fontWeight='bold' sx={{ mb: 1 }}>
								Cliente
							</Typography>
							<TextField
								placeholder='Cliente'
								variant='outlined'
								fullWidth
								value={itemToEdit?.CLIENTE || ''}
								onChange={(e) =>
									setItemToEdit({ ...itemToEdit, CLIENTE: e.target.value })
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

						<Grid item xs={12}>
							<Typography variant='body2' fontWeight='bold' sx={{ mb: 1 }}>
								Contacto
							</Typography>
							<TextField
								placeholder='Contacto'
								variant='outlined'
								fullWidth
								value={itemToEdit?.CONTACT || ''}
								onChange={(e) =>
									setItemToEdit({ ...itemToEdit, CONTACT: e.target.value })
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
					</Grid>
				</DialogContent>

				<DialogActions sx={{ mt: 2 }}>
					<Button onClick={handleCancelEdit}>Cancelar</Button>
					<Button variant='contained' onClick={handleSaveEdit} color='primary'>
						Guardar
					</Button>
				</DialogActions>
			</Dialog>
		</Container>
	);
};

export default Reminders;
