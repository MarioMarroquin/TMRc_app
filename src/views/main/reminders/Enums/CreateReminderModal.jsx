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
	const availableDates = Array.from({ length: 8 }, (_, i) =>
		format(addDays(today, i + 1), 'dd/MM/yyyy')
	);
	const availableTimes = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00'];

	const [selectedDate, setSelectedDate] = useState('');
	const [selectedTime, setSelectedTime] = useState('');
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');

	useEffect(() => {
		if (reminder) {
			setTitle(reminder.title || '');
			setSelectedDate(reminder.date || '');
			setSelectedTime(reminder.time || '');
			setDescription(reminder.description || '');
		} else {
			// Limpiar campos si no hay recordatorio
			setTitle('');
			setSelectedDate('');
			setSelectedTime('');
			setDescription('');
		}
	}, [reminder, open]);

	const handleSave = () => {
		const newReminder = {
			id: reminder ? reminder.id : Date.now(),
			date: selectedDate,
			time: selectedTime,
			title,
			description: `${selectedDate} - ${selectedTime}`,
			type: reminder?.type ?? 'personal',
			columnId: reminder?.columnId,
		};
		onSave(newReminder);
		handleClose();
	};

	const handleClose = () => {
		setTitle('');
		setSelectedDate('');
		setSelectedTime('');
		setDescription('');
		onClose();
	};

	return (
		<Modal open={open} onClose={handleClose}>
			<Box sx={modalStyle}>
				<Typography variant='h6' mb={2}>
					{reminder ? 'Editar Recordatorio' : 'Nuevo Recordatorio'}
				</Typography>

				<FormControl fullWidth sx={{ mb: 2 }}>
					<InputLabel>Fecha</InputLabel>
					<Select
						value={selectedDate}
						label='Fecha'
						onChange={(e) => setSelectedDate(e.target.value)}
					>
						{availableDates.map((date) => (
							<MenuItem key={date} value={date}>
								{date}
							</MenuItem>
						))}
					</Select>
				</FormControl>

				<FormControl fullWidth sx={{ mb: 2, mt: 2 }}>
					<InputLabel>Hora</InputLabel>
					<Select
						value={selectedTime}
						label='Hora'
						onChange={(e) => setSelectedTime(e.target.value)}
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
					multiline
					minRows={3}
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					sx={{ mb: 2, mt: 2 }}
				/>

				<Box display='flex' justifyContent='flex-end' gap={1} mt={2}>
					<Button onClick={handleClose} variant='outlined'>
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
