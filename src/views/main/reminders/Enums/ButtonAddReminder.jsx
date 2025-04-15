import React, { useState } from 'react';
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
	Stack,
	Typography,
} from '@mui/material';
import NotificationAddIcon from '@mui/icons-material/NotificationAdd';
import toast from 'react-hot-toast';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import es from 'date-fns/locale/es';

const ButtonAddReminder = () => {
	const [open, setOpen] = useState(false);
	const [mensaje, setMensaje] = useState('');
	const [fecha, setFecha] = useState(null);
	const [confirmOpen, setConfirmOpen] = useState(false);

	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	const handleSave = () => {
		console.log('Mensaje:', mensaje);
		console.log('Fecha:', fecha);
		toast.success('📬 Recordatorio enviado');
		setConfirmOpen(false);
		setOpen(false);
	};

	return (
		<>
			<Button
				variant='contained'
				color='success'
				startIcon={<NotificationAddIcon />}
				onClick={handleOpen}
			>
				Agregar Recordatorio
			</Button>

			<Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
				<DialogTitle>Nuevo Recordatorio</DialogTitle>
				<DialogContent sx={{ minHeight: '100px' }}>
					<Stack spacing={10}>
						{/* MENSAJE */}
						<TextField
							placeholder='Agrega cualquier texto que desees'
							variant='outlined'
							fullWidth
							multiline
							minRows={4}
							value={mensaje}
							onChange={(e) => setMensaje(e.target.value)}
							InputLabelProps={{ shrink: false }}
						/>

						{/* FECHA */}
						<LocalizationProvider
							dateAdapter={AdapterDateFns}
							adapterLocale={es}
						>
							<DatePicker
								label='' // sin label
								value={fecha}
								onChange={(newValue) => setFecha(newValue)}
								renderInput={(params) => (
									<TextField
										{...params}
										fullWidth
										placeholder='Selecciona una fecha'
										InputLabelProps={{ shrink: false }}
									/>
								)}
							/>
						</LocalizationProvider>
					</Stack>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color='inherit'>
						Cancelar
					</Button>
					<Button
						onClick={() => setConfirmOpen(true)}
						variant='contained'
						color='primary'
					>
						Guardar
					</Button>
				</DialogActions>
			</Dialog>

			<Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
				<DialogTitle>Confirmacion de envio</DialogTitle>
				<DialogContent>
					<Typography>
						¿Estás seguro de que deseas enviar este recordatorio?
					</Typography>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setConfirmOpen(false)} color='inherit'>
						Cancelar
					</Button>
					<Button
						onClick={() => {
							handleSave();
						}}
						variant='contained'
						color='primary'
					>
						Sí, enviar
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default ButtonAddReminder;
