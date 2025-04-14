import React, { useState, useEffect } from 'react';
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Button,
	TextField,
	Grid,
} from '@mui/material';

const DialogReminderEdit = ({ open, onClose, item, onSave }) => {
	const [editedItem, setEditedItem] = useState({});

	useEffect(() => {
		if (item) {
			setEditedItem({ ...item });
		}
	}, [item]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setEditedItem((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const handleSave = () => {
		onSave(editedItem);
		onClose();
	};

	return (
		<Dialog open={open} onClose={onClose} sx={{ minHeight: '400px' }}>
			<DialogTitle>Editar Recordatorio</DialogTitle>
			<DialogContent sx={{ minHeight: '300px' }}>
				<Grid container spacing={3}>
					<Grid item xs={12} sx={{ marginTop: '10px' }}>
						<TextField
							label='Folio'
							name='FOLIO'
							value={editedItem.FOLIO || ''}
							onChange={handleChange}
							fullWidth
							sx={{
								'& .MuiInputLabel-root': {
									fontSize: '20px',
									fontWeight: 'bold',
								},
							}}
						/>
					</Grid>
					<Grid item xs={12} sx={{ marginTop: '10px' }}>
						<TextField
							label='Servicio'
							name='SERVICIO'
							value={editedItem.SERVICIO || ''}
							onChange={handleChange}
							fullWidth
							sx={{
								'& .MuiInputLabel-root': {
									fontSize: '20px',
									fontWeight: 'bold',
								},
							}}
						/>
					</Grid>
					<Grid item xs={12} sx={{ marginTop: '10px' }}>
						<TextField
							label='Empresa'
							name='EMPRESA'
							value={editedItem.EMPRESA || ''}
							onChange={handleChange}
							fullWidth
							sx={{
								'& .MuiInputLabel-root': {
									fontSize: '20px',
									fontWeight: 'bold',
								},
							}}
						/>
					</Grid>
					<Grid item xs={12} sx={{ marginTop: '10px' }}>
						<TextField
							label='Cliente'
							name='CLIENTE'
							value={editedItem.CLIENTE || ''}
							onChange={handleChange}
							fullWidth
							sx={{
								'& .MuiInputLabel-root': {
									fontSize: '20px',
									fontWeight: 'bold',
								},
							}}
						/>
					</Grid>
					<Grid item xs={12} sx={{ marginTop: '10px' }}>
						<TextField
							label='Contacto'
							name='CONTACT'
							value={editedItem.CONTACT || ''}
							onChange={handleChange}
							fullWidth
							sx={{
								'& .MuiInputLabel-root': {
									fontSize: '20px',
									fontWeight: 'bold',
								},
							}}
						/>
					</Grid>
				</Grid>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} color='primary'>
					Cancelar
				</Button>
				<Button onClick={handleSave} color='secondary'>
					Guardar
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default DialogReminderEdit;
