import React, { useState } from 'react';
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
	const [title, setTitle] = useState('');
	const [selectedTime, setSelectedTime] = useState('12:00');
	const [type, setType] = useState('personal');
	const [empresa, setEmpresa] = useState('');
	const [cliente, setCliente] = useState('');

	const handleSubmit = (e) => {
		e.preventDefault();

		if (!title.trim() || !selectedTime) {
			toast.error('Por favor completa todos los campos requeridos');
			return;
		}

		const today = new Date();
		const formattedDate = `${String(today.getDate()).padStart(2, '0')}/${String(
			today.getMonth() + 1
		).padStart(2, '0')}/${today.getFullYear()}`;

		const newReminder = {
			id: Date.now(),
			title: title.trim(),
			description: `${formattedDate} - ${selectedTime}`,
			type: 'personal',
		};

		onSave(columnId, newReminder);
		handleClose();
	};

	const handleClose = () => {
		setTitle('');
		setSelectedTime('12:00');
		onClose();
	};

	const handleTimeChange = (e) => {
		const value = e.target.value;
		setSelectedTime(value);
	};

	return (
		<Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
			<form onSubmit={handleSubmit}>
				<DialogTitle>Agregar Recordatorio Rápido</DialogTitle>
				<DialogContent>
					<Stack spacing={2} sx={{ mt: 1 }}>
						<TextField
							autoFocus
							label='Nota'
							fullWidth
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							required
						/>

						<TextField
							label='Hora'
							type='time'
							value={selectedTime}
							onChange={(e) => setSelectedTime(e.target.value)}
							fullWidth
							InputLabelProps={{
								shrink: true,
							}}
							inputProps={{
								step: 300, // 5 min
							}}
							required
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
