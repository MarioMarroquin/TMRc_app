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
		reminder ? reminder.date : ''
	);
	const [selectedTime, setSelectedTime] = useState(
		reminder ? reminder.time : ''
	);
	const [title, setTitle] = useState(reminder ? reminder.title : '');
	const [description, setDescription] = useState(
		reminder ? reminder.description : ''
	);

	const [availableDates, setAvailableDates] = useState(
		Array.from({ length: 8 }, (_, i) =>
			format(addDays(today, i + 1), 'dd/MM/yyyy')
		)
	);
	const availableTimes = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00'];

	useEffect(() => {
		if (reminder) {
			// Aquí estamos obteniendo la fecha de la card y poniéndola en el formato adecuado
			const [parsedDate, parsedTime] = reminder.description?.split(' / ') || [];

			// Si parsedDate existe y está en el formato correcto, la asignamos
			if (parsedDate) {
				const normalizedDate = parsedDate.replaceAll('-', '/'); // Aseguramos que esté en el formato 'dd/MM/yyyy'

				// Verificamos si la fecha es válida dentro de las fechas disponibles
				const matchedDate = availableDates.includes(normalizedDate)
					? normalizedDate
					: availableDates[0];

				setSelectedDate(matchedDate); // Seteamos la fecha en el estado
			}
			setSelectedTime(parsedTime || ''); // Aseguramos que se setee la hora también

			setTitle(reminder.title || '');
			setDescription(reminder.description || '');
		} else {
			// Si no hay un recordatorio, los campos deben estar vacíos o con valores por defecto
			setSelectedDate(''); // Deja la fecha vacía (o puedes poner la fecha por defecto si prefieres)
			setSelectedTime(''); // Deja la hora vacía
			setTitle(''); // Título vacío
			setDescription(''); // Descripción vacía
		}
	}, [reminder, availableDates]);

	const handleSave = () => {
		const newReminder = {
			id: reminder ? reminder.id : Date.now(),
			date: selectedDate,
			time: selectedTime,
			title,
			description: `${selectedDate.replaceAll('-', '/')} - ${selectedTime}`,
			// Este es el cambio importante:
			type: reminder && reminder.type ? reminder.type : 'personal',
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

				<FormControl fullWidth sx={{ mb: 16 }}>
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

				<FormControl fullWidth sx={{ mb: 16 }}>
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
					multiline
					minRows={3} // Ajusta este número si quieres más alto
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					sx={{ mb: 16 }}
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
