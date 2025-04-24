// users/UserModal.jsx
import React from 'react';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Button,
	FormControlLabel,
	Switch,
	Stack,
	Divider,
} from '@mui/material';

const UserModal = ({
	open,
	handleClose,
	handleSave,
	userData,
	setUserData,
	isEdit,
}) => {
	const handleChange = (e) => {
		const { name, value } = e.target;
		setUserData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSwitch = () => {
		setUserData((prev) => ({ ...prev, activo: !prev.activo }));
	};

	return (
		<Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
			<DialogTitle>{isEdit ? 'Editar Usuario' : 'Agregar Usuario'}</DialogTitle>
			<DialogContent>
				<Stack spacing={3} mt={1}>
					{/* Campos */}
					<TextField
						label='Nombre'
						name='nombre'
						fullWidth
						variant='outlined'
						value={userData.nombre}
						onChange={handleChange}
					/>
					<TextField
						label='Apellido'
						name='apellido'
						fullWidth
						variant='outlined'
						value={userData.apellido}
						onChange={handleChange}
					/>
					<TextField
						label='Rol'
						name='rol'
						fullWidth
						variant='outlined'
						value={userData.rol}
						onChange={handleChange}
					/>
					<TextField
						label='Nombre de Usuario'
						name='usuario'
						fullWidth
						variant='outlined'
						value={userData.usuario}
						onChange={handleChange}
					/>
					<TextField
						label='Teléfono'
						name='telefono'
						fullWidth
						variant='outlined'
						value={userData.telefono}
						onChange={handleChange}
					/>

					<TextField
						label='Email'
						name='email'
						fullWidth
						variant='outlined'
						value={userData.email}
						onChange={handleChange}
					/>

					<Divider sx={{ my: 1 }} />

					<FormControlLabel
						control={
							<Switch checked={userData.activo} onChange={handleSwitch} />
						}
						label={userData.activo ? 'Activo' : 'Desactivado'}
					/>
				</Stack>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose}>Cancelar</Button>
				<Button variant='contained' onClick={handleSave}>
					Guardar
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default UserModal;
