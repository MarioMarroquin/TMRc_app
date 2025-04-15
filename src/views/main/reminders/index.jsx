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
	} = useReminders();

	const [showList, setShowList] = useState(
		!!JSON.parse(localStorage.getItem('showList'))
	);

	useEffect(() => {
		localStorage.setItem('showList', JSON.stringify(showList));
	}, [showList]);

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
				<CompleteList CompleteList={completedList} />
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
				<DialogTitle>Editar Recordatorio</DialogTitle>
				<DialogContent>
					<Grid container spacing={2} sx={{ mt: 1 }}>
						<Grid item xs={12} sm={6}>
							<Typography variant='body2' fontWeight='bold'>
								Folio
							</Typography>
							<input
								type='text'
								value={itemToEdit?.FOLIO || ''}
								onChange={(e) =>
									setItemToEdit({ ...itemToEdit, FOLIO: e.target.value })
								}
								style={{ width: '100%', padding: '8px', marginTop: '5px' }}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<Typography variant='body2' fontWeight='bold'>
								Servicio
							</Typography>
							<input
								type='text'
								value={itemToEdit?.SERVICIO || ''}
								onChange={(e) =>
									setItemToEdit({ ...itemToEdit, SERVICIO: e.target.value })
								}
								style={{ width: '100%', padding: '8px', marginTop: '5px' }}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<Typography variant='body2' fontWeight='bold'>
								Empresa
							</Typography>
							<input
								type='text'
								value={itemToEdit?.EMPRESA || ''}
								onChange={(e) =>
									setItemToEdit({ ...itemToEdit, EMPRESA: e.target.value })
								}
								style={{ width: '100%', padding: '8px', marginTop: '5px' }}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<Typography variant='body2' fontWeight='bold'>
								Cliente
							</Typography>
							<input
								type='text'
								value={itemToEdit?.CLIENTE || ''}
								onChange={(e) =>
									setItemToEdit({ ...itemToEdit, CLIENTE: e.target.value })
								}
								style={{ width: '100%', padding: '8px', marginTop: '5px' }}
							/>
						</Grid>
						<Grid item xs={12}>
							<Typography variant='body2' fontWeight='bold'>
								Contacto
							</Typography>
							<input
								type='text'
								value={itemToEdit?.CONTACT || ''}
								onChange={(e) =>
									setItemToEdit({ ...itemToEdit, CONTACT: e.target.value })
								}
								style={{ width: '100%', padding: '8px', marginTop: '5px' }}
							/>
						</Grid>
					</Grid>
				</DialogContent>
				<DialogActions>
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
