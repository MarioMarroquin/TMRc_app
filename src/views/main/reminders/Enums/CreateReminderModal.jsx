import { useState, useEffect } from 'react';
import {
	Modal,
	Box,
	Typography,
	Button,
	TextField,
	MenuItem,
	Select,
	InputLabel,
	FormControl,
} from '@mui/material';
import { addDays, format } from 'date-fns';

const modalStyle = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 400,
	bgcolor: 'background.paper',
	boxShadow: 24,
	p: 4,
	borderRadius: 2,
};

export const CreateReminderModal = ({ open, onClose, onSave, reminder }) => {
	const today = new Date();
	const [selectedDate, setSelectedDate] = useState(
		reminder ? reminder.date : format(addDays(today, 1), 'yyyy-MM-dd')
	);
	const [selectedTime, setSelectedTime] = useState(
		reminder ? reminder.time : ''
	);

	const availableDates = Array.from({ length: 8 }, (_, i) =>
		format(addDays(today, i + 1), 'dd-MM-yyyy')
	);
	const availableTimes = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00'];

	const [title, setTitle] = useState(reminder ? reminder.title : '');
	const [description, setDescription] = useState(
		reminder ? reminder.description : ''
	);

	useEffect(() => {
		if (reminder) {
			setSelectedDate(reminder.date);
			setSelectedTime(reminder.time);
			setTitle(reminder.title);
		}
	}, [reminder]);

	const handleSave = () => {
		const newReminder = {
			id: reminder ? reminder.id : Date.now(),
			date: selectedDate,
			time: selectedTime,
			title,
			type: reminder?.type || 'personal',
		};
		onSave(newReminder);
		onClose();
	};
	return (
		<Modal open={open} onClose={onClose}>
			<Box sx={modalStyle}>
				<Typography variant='h6' mb={2}>
					{reminder ? 'Editar Recordatorio' : 'Nuevo Recordatorio'}
				</Typography>

				<FormControl fullWidth sx={{ mb: 2 }}>
					<InputLabel>Fecha</InputLabel>
					<Select
						value={selectedDate}
						onChange={(e) => setSelectedDate(e.target.value)}
						label='Fecha'
					>
						{availableDates.map((date) => (
							<MenuItem key={date} value={date}>
								{date}
							</MenuItem>
						))}
					</Select>
				</FormControl>

				<FormControl fullWidth sx={{ mb: 2 }}>
					<InputLabel>Hora</InputLabel>
					<Select
						value={selectedTime}
						onChange={(e) => setSelectedTime(e.target.value)}
						label='Hora'
					>
						{availableTimes.map((time) => (
							<MenuItem key={time} value={time}>
								{time}
							</MenuItem>
						))}
					</Select>
				</FormControl>

				<TextField
					label='Nota'
					fullWidth
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					sx={{ mb: 2 }}
				/>

				<Box display='flex' justifyContent='flex-end' gap={1}>
					<Button onClick={onClose} variant='outlined'>
						Cancelar
					</Button>
					<Button onClick={handleSave} variant='contained'>
						{reminder ? 'Guardar' : 'Crear'}
					</Button>
				</Box>
			</Box>
		</Modal>
	);
};
