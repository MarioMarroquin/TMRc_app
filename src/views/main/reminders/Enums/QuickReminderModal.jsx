import { useState } from 'react';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	TextField,
	Stack,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
} from '@mui/material';
import toast from 'react-hot-toast';

const QuickReminderModal = ({ open, columnId, onClose, onSave }) => {
	const [selectedDate, setSelectedDate] = useState('');
	const [selectedTime, setSelectedTime] = useState('');
	const [note, setNote] = useState('');

	// Generar lista de fechas (6 días desde hoy)
	const generateAvailableDates = () => {
		const dates = [];
		const today = new Date();
		for (let i = 0; i < 6; i++) {
			const date = new Date(today);
			date.setDate(today.getDate() + i);
			const formattedDate = date
				.toLocaleDateString('es-ES', {
					day: '2-digit',
					month: '2-digit',
					year: 'numeric',
				})
				.replace(/\//g, '/');
			dates.push(formattedDate);
		}
		return dates;
	};

	// Generar lista de 10 horarios
	const generateAvailableTimes = () => {
		const times = [];
		for (let hour = 8; hour <= 17; hour++) {
			// 10 horas desde las 8:00 hasta las 17:00
			times.push(`${hour.toString().padStart(2, '0')}:00`);
		}
		return times;
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		if (!selectedDate || !selectedTime || !note.trim()) {
			toast.error('Por favor completa todos los campos');
			return;
		}

		const newReminder = {
			id: Date.now(),
			title: note.trim(),
			description: `${selectedDate} - ${selectedTime}`,
			type: 'personal', // Cambiado a 'personal' para nuevas cards
		};

		onSave(columnId, newReminder);
		handleClose();
	};

	const handleClose = () => {
		setSelectedDate('');
		setSelectedTime('');
		setNote('');
		onClose();
	};

	return (
		<Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
			<form onSubmit={handleSubmit}>
				<DialogTitle>Agregar Recordatorio</DialogTitle>
				<DialogContent>
					<Stack spacing={2} sx={{ mt: 2 }}>
						<FormControl fullWidth>
							<InputLabel>Fecha</InputLabel>
							<Select
								value={selectedDate}
								label='Fecha'
								onChange={(e) => setSelectedDate(e.target.value)}
								required
							>
								{generateAvailableDates().map((date) => (
									<MenuItem key={date} value={date}>
										{date}
									</MenuItem>
								))}
							</Select>
						</FormControl>

						<FormControl fullWidth>
							<InputLabel>Hora</InputLabel>
							<Select
								value={selectedTime}
								label='Hora'
								onChange={(e) => setSelectedTime(e.target.value)}
								required
							>
								{generateAvailableTimes().map((time) => (
									<MenuItem key={time} value={time}>
										{time}
									</MenuItem>
								))}
							</Select>
						</FormControl>

						<TextField
							label='Nota'
							multiline
							rows={3}
							value={note}
							onChange={(e) => setNote(e.target.value)}
							fullWidth
							required
							placeholder='Escribe tu nota aquí...'
						/>
					</Stack>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>Cancelar</Button>
					<Button type='submit' variant='contained'>
						Guardar
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
};

export default QuickReminderModal;
