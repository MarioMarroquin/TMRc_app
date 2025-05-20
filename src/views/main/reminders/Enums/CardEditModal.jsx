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
import toast from 'react-hot-toast';

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

export const CardEditModal = ({
	open,
	reminder,
	columnId,
	onClose,
	setColumns,
	tempRemovedItem,
	sourceColumnId,
	setTempRemovedItem,
	setSourceColumnId,
}) => {
	const [editedReminder, setEditedReminder] = useState({
		date: '',
		time: '',
		title: '',
	});

	useEffect(() => {
		if (reminder) {
			const [date, time] = reminder.description?.split(' - ') || ['', ''];
			setEditedReminder({
				date: date || '',
				time: time || '',
				title: reminder.title || '',
			});
		}
	}, [reminder]);

	const handleSave = () => {
		if (
			!editedReminder.date ||
			!editedReminder.time ||
			!editedReminder.title.trim()
		) {
			toast.error('Por favor completa todos los campos');
			return;
		}

		const updatedReminder = {
			...(tempRemovedItem || reminder), // Usar tempRemovedItem si existe
			title: editedReminder.title.trim(),
			description: `${editedReminder.date} - ${editedReminder.time}`,
			type: reminder?.type || 'personal',
		};

		setColumns((prev) => ({
			...prev,
			[columnId]: [...prev[columnId], updatedReminder],
		}));

		// Limpiar estados temporales
		setTempRemovedItem(null);
		setSourceColumnId(null);

		onClose();
		toast.success('✔️ Recordatorio actualizado');
	};

	// Generar fechas disponibles (igual que en CreateReminderModal)
	const generateAvailableDates = () => {
		const dates = [];
		const today = new Date();
		for (let i = 0; i < 7; i++) {
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

	// Generar horas disponibles (igual que en CreateReminderModal)
	const generateAvailableTimes = () => {
		const times = [];
		for (let hour = 8; hour <= 18; hour++) {
			times.push(`${hour.toString().padStart(2, '0')}:00`);
			times.push(`${hour.toString().padStart(2, '0')}:30`);
		}
		return times;
	};

	const handleCancel = () => {
		// Si hay un recordatorio temporal removido, lo devolvemos a su columna original
		if (tempRemovedItem && sourceColumnId) {
			setColumns((prev) => ({
				...prev,
				[sourceColumnId]: [...prev[sourceColumnId], tempRemovedItem],
			}));

			// Limpiar estados temporales
			setTempRemovedItem(null);
			setSourceColumnId(null);
		}
		onClose();
	};

	return (
		<Modal open={open} onClose={handleCancel}>
			<Box sx={modalStyle}>
				<Typography variant='h6' mb={2}>
					Editar Recordatorio
				</Typography>

				<FormControl fullWidth sx={{ mb: 2 }}>
					<InputLabel>Fecha</InputLabel>
					<Select
						value={editedReminder.date}
						label='Fecha'
						onChange={(e) =>
							setEditedReminder({ ...editedReminder, date: e.target.value })
						}
					>
						{generateAvailableDates().map((date) => (
							<MenuItem key={date} value={date}>
								{date}
							</MenuItem>
						))}
					</Select>
				</FormControl>

				<FormControl fullWidth sx={{ mb: 2 }}>
					<InputLabel>Hora</InputLabel>
					<Select
						value={editedReminder.time}
						label='Hora'
						onChange={(e) =>
							setEditedReminder({ ...editedReminder, time: e.target.value })
						}
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
					fullWidth
					multiline
					minRows={3}
					value={editedReminder.title}
					onChange={(e) =>
						setEditedReminder({ ...editedReminder, title: e.target.value })
					}
					sx={{ mb: 2 }}
				/>

				<Box display='flex' justifyContent='flex-end' gap={1}>
					<Button variant='outlined' onClick={handleCancel}>
						Cancelar
					</Button>
					<Button variant='contained' onClick={handleSave}>
						Guardar
					</Button>
				</Box>
			</Box>
		</Modal>
	);
};
