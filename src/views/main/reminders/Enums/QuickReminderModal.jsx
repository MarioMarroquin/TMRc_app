import { useState, useEffect } from 'react';
import {
	Modal,
	Box,
	Typography,
	Button,
	TextField,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
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

export const QuickReminderModal = ({
	open,
	onClose,
	onSave,
	columnId,
	reminder,
}) => {
	const today = new Date();
	const availableDates = Array.from({ length: 8 }, (_, i) =>
		format(addDays(today, i + 1), 'dd/MM/yyyy')
	);
	const availableTimes = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00'];

	const [title, setTitle] = useState('');
	const [selectedDate, setSelectedDate] = useState(availableDates[0]);
	const [selectedTime, setSelectedTime] = useState(availableTimes[0]);
	const [description, setDescription] = useState('');

	const handleSave = () => {
		if (!title.trim()) return;

		const titleLines = title.split('\n');
		const actualTitle = titleLines[0]; // Tomamos la primera línea como título real

		const newReminder = {
			id: Date.now(),
			title: actualTitle,
			description: `${selectedDate} - ${selectedTime}`,
			date: selectedDate,
			time: selectedTime,
			type: 'personal',
		};

		onSave(columnId, newReminder);
	};

	const handleClose = () => {
		setTitle('');
		setSelectedDate(availableDates[0]);
		setSelectedTime(availableTimes[0]);
		setDescription('');
		onClose();
	};

	useEffect(() => {
		if (open) {
			if (!reminder) {
				// Si es un nuevo recordatorio
				setTitle('');
				setSelectedDate(availableDates[0]);
				setSelectedTime(availableTimes[0]);
				setDescription('');
			} else {
				// Si estamos editando un recordatorio existente
				if (reminder.description) {
					// Extraer fecha y hora de la descripción
					const [datePart, timePart] = reminder.description.split(' - ');

					// Establecer los valores en los campos correspondientes
					setTitle(reminder.title || ''); // Para la nota
					setSelectedDate(datePart); // Para el campo de fecha
					setSelectedTime(timePart || availableTimes[0]); // Para el campo de hora
				}
			}
		}
	}, [open, reminder, availableDates, availableTimes]);

	return (
		<Modal open={open} onClose={handleClose}>
			<Box sx={modalStyle}>
				<Typography variant='h6' mb={2}>
					Nuevo Recordatorio Personal
				</Typography>

				<FormControl fullWidth sx={{ mb: 16 }}>
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

				<FormControl fullWidth sx={{ mb: 16 }}>
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
					sx={{ mb: 16 }}
				/>

				<Box display='flex' justifyContent='flex-end' gap={1}>
					<Button variant='outlined' onClick={handleClose}>
						Cancelar
					</Button>
					<Button variant='contained' onClick={handleSave}>
						Crear
					</Button>
				</Box>
			</Box>
		</Modal>
	);
};
