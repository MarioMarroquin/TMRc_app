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

export const QuickReminderModal = ({
	open,
	columnId,
	onClose,
	selectedDate,
	setSelectedDate,
	selectedTime,
	setSelectedTime,
	title,
	setTitle,
	availableDates,
	availableTimes,
	onSave,
}) => {
	const handleCreate = () => {
		// Validación de campos
		if (!selectedDate || !selectedTime || !title.trim()) {
			toast.error('Por favor completa todos los campos');
			return;
		}

		onSave();
	};

	return (
		<Modal open={open} onClose={onClose}>
			<Box sx={modalStyle}>
				<Typography variant='h6' mb={2}>
					Nuevo Recordatorio Personal
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

				<FormControl fullWidth sx={{ mb: 2 }}>
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
					sx={{ mb: 2 }}
				/>

				<Box display='flex' justifyContent='flex-end' gap={1}>
					<Button variant='outlined' onClick={onClose}>
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
