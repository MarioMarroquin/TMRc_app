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

export const QuickReminderModal = ({ open, onClose, onSave, columnId }) => {
	const today = new Date();

	const availableDates = Array.from({ length: 8 }, (_, i) =>
		format(addDays(today, i + 1), 'dd/MM/yyyy')
	);
	const availableTimes = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00'];

	const [title, setTitle] = useState('');
	const [selectedDate, setSelectedDate] = useState(availableDates[0]);
	const [selectedTime, setSelectedTime] = useState(availableTimes[0]);

	const handleSave = () => {
		if (!title.trim()) return;

		const newReminder = {
			id: Date.now(),
			title,
			description: `${selectedDate} - ${selectedTime}`,
			date: selectedDate,
			time: selectedTime,
			type: 'personal',
		};

		onSave(columnId, newReminder);
		onClose();
		// resetear campos
		setTitle('');
		setSelectedDate(availableDates[0]);
		setSelectedTime(availableTimes[0]);
	};

	useEffect(() => {
		if (open) {
			setTitle('');
			setSelectedDate(availableDates[0]);
			setSelectedTime(availableTimes[0]);
		}
	}, [open]);

	return (
		<Modal open={open} onClose={onClose}>
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
					minRows={3} // Ajusta este número si quieres más alto
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					sx={{ mb: 16 }}
				/>

				<Box display='flex' justifyContent='flex-end' gap={1}>
					<Button variant='outlined' onClick={onClose}>
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
