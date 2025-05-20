import { useState, useEffect } from 'react'; // Añadir useEffect
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

export const CreateReminderModal = ({ open, onClose, columns, setColumns }) => {
	const [selectedDate, setSelectedDate] = useState('');
	const [selectedTime, setSelectedTime] = useState('');
	const [title, setTitle] = useState('');
	const [selectedSection, setSelectedSection] = useState('HOY');

	const menuProps = {
		PaperProps: {
			style: {
				maxHeight: 200, // ajusta este valor según necesites
				overflow: 'auto',
			},
		},
	};

	// Generar fechas disponibles
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

	// Generar horas disponibles
	const generateAvailableTimes = () => {
		const times = [];
		for (let hour = 8; hour <= 18; hour++) {
			times.push(`${hour.toString().padStart(2, '0')}:00`);
			times.push(`${hour.toString().padStart(2, '0')}:30`);
		}
		return times;
	};

	const handleCreate = () => {
		if (!selectedDate || !selectedTime || !title.trim()) {
			toast.error('Por favor completa todos los campos');
			return;
		}

		const newReminder = {
			id: Date.now(),
			title: title.trim(),
			description: `${selectedDate} - ${selectedTime}`,
			type: 'personal',
		};

		// Actualizar el estado de las columnas inmediatamente
		setColumns((prev) => ({
			...prev,
			[selectedSection]: [...prev[selectedSection], newReminder],
		}));

		// Limpiar el formulario
		setSelectedDate('');
		setSelectedTime('');
		setTitle('');
		setSelectedSection('HOY');

		// Cerrar el modal y mostrar mensaje de éxito
		onClose();
		toast.success('✔️ Recordatorio creado exitosamente');
	};

	const handleCancel = () => {
		// Limpiar el formulario
		setSelectedDate('');
		setSelectedTime('');
		setTitle('');
		setSelectedSection('HOY');
		onClose();
	};

	return (
		<Modal open={open} onClose={handleCancel}>
			<Box sx={modalStyle}>
				<Typography variant='h6' mb={2}>
					Nuevo Recordatorio Personal
				</Typography>

				<FormControl fullWidth sx={{ mb: 2 }}>
					<InputLabel>Sección</InputLabel>
					<Select
						value={selectedSection}
						label='Sección'
						onChange={(e) => setSelectedSection(e.target.value)}
					>
						<MenuItem value='HOY'>HOY</MenuItem>
						<MenuItem value='POR VENCER'>POR VENCER</MenuItem>
					</Select>
				</FormControl>

				<FormControl fullWidth sx={{ mb: 2 }}>
					<InputLabel>Fecha</InputLabel>
					<Select
						value={selectedDate}
						label='Fecha'
						onChange={(e) => setSelectedDate(e.target.value)}
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
						value={selectedTime}
						label='Hora'
						onChange={(e) => setSelectedTime(e.target.value)}
						MenuProps={menuProps}
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
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					sx={{ mb: 2 }}
				/>

				<Box display='flex' justifyContent='flex-end' gap={1}>
					<Button variant='outlined' onClick={handleCancel}>
						Cancelar
					</Button>
					<Button variant='contained' onClick={handleCreate}>
						Crear
					</Button>
				</Box>
			</Box>
		</Modal>
	);
};
