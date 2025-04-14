import PropTypes from 'prop-types';
import React, { Fragment, useState, useEffect } from 'react';
import {
	Box,
	Button,
	List,
	ListItem,
	ListItemText,
	ListSubheader,
	Stack,
	Edit,
	Delete,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Grid,
	Typography,
	Container,
	Switch,
	FormControl,
	FormControlLabel,
	Radio,
	RadioGroup,
	Paper,
} from '@mui/material';
import toast from 'react-hot-toast';
import { Sync } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import useReminderCreate from '@views/main/reminders/DialogReminderCreate/useReminderCreate';
import {
	useEliminarFila,
	useConfirmDelete,
} from '@views/main/reminders/ButtonsDisplay/Buttons.js';
import DialogReminderEdit from '@views/main/reminders/DialogReminderEdit/DialogReminderEdit.jsx';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import ListIcon from '@mui/icons-material/List';
import WindowIcon from '@mui/icons-material/Window';
import ListReminder from '@views/main/reminders/Enums/list.jsx';
import Kanban from '@views/main/reminders/Enums/Kanban.jsx';
import NotificationAddIcon from '@mui/icons-material/NotificationAdd';
import PlaylistAddCheckCircleIcon from '@mui/icons-material/PlaylistAddCheckCircle';
import ViewWeekIcon from '@mui/icons-material/ViewWeek';
import CompletedReminders from './Enums/CompletedReminders';
import { reminderData } from './ReminderData.js';
import ButtonAddReminder from '@views/main/reminders/Enums/ButtonAddReminder.jsx';

const clasificarRemindersPorFecha = (dataOriginal) => {
	const hoy = new Date();
	hoy.setHours(0, 0, 0, 0);

	const columnas = {
		vencidas: [],
		hoy: [],
		'por Vencer': [],
	};

	Object.entries(dataOriginal).forEach(([seccion, bloques]) => {
		bloques.forEach((bloque) => {
			const fechaStr = bloque.FECHA;
			const [año, mes, dia] = fechaStr.split('/');

			const fechaItem = new Date(año, parseInt(mes) - 1, dia);
			fechaItem.setHours(0, 0, 0, 0);

			bloque.LIST.forEach((item) => {
				const itemConFecha = {
					...item,
					fecha: `${dia}/${mes}/${año}`,
				};

				if (fechaItem < hoy) {
					columnas.vencidas.push(itemConFecha);
				} else if (fechaItem.getTime() === hoy.getTime()) {
					columnas.hoy.push(itemConFecha);
				} else {
					columnas['por Vencer'].push(itemConFecha);
				}
			});
		});
	});

	return columnas;
};

const Reminders = (props) => {
	const [selectedIndex, setSelectedIndex] = useState(null);
	const useReminder = useReminderCreate();
	const [open, setOpen] = useState(false);
	const [editingItem, setEditingItem] = useState(null);
	const [openDialogg, setOpenDialogg] = useState(false);
	const [showList, setShowList] = useState(
		!!JSON.parse(localStorage.getItem('showList'))
	);

	const [CompletedList, setCompletedList] = useState([]);
	const [selectedView, setSelectedView] = useState('hoy');

	useEffect(() => {
		localStorage.setItem('showList', JSON.stringify(showList));
	}, [showList]);

	const handleClick = (index) => {
		setSelectedIndex(index);
	};

	return (
		<Container sx={{ paddingTop: '5px' }}>
			<Grid
				container
				alignItems='center'
				justifyContent='space-between'
				sx={{ mb: 2 }}
			>
				{/* Botón a la izquierda */}
				<Grid item>{showList && <ButtonAddReminder />}</Grid>

				{/* RadioGroup al centro */}
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

				{/* Switch a la derecha */}
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
				<CompletedReminders CompletedList={CompletedList} />
			) : showList ? (
				<ListReminder
					data={reminderData[selectedView]}
					CompletedList={CompletedList}
					setCompletedList={setCompletedList}
				/>
			) : (
				<Kanban reminderData={clasificarRemindersPorFecha(reminderData)} />
			)}
		</Container>
	);
};

Reminders.propTypes = {};

export default Reminders;
