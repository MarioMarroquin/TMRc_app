// users/UsersTable.jsx
import React from 'react';
import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Switch,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';

const UsersTable = ({
	users,
	handleEditUser,
	handleAddUserClick,
	handleConfirmDelete,
	handleCancelDelete,
	openDeleteDialog,
	selectedUser,
	toggleActivo,
}) => {
	const getColumns = (toggleActivo, handleEditUser) => [
		{ field: 'nombre', headerName: 'Nombre', flex: 1 },
		{ field: 'apellidoPaterno', headerName: 'Apellido Paterno', flex: 1 },
		{ field: 'apellidoMaterno', headerName: 'Apellido Materno', flex: 1 },
		{ field: 'telefono', headerName: 'Teléfono', flex: 1 },
		{ field: 'usuario', headerName: 'Usuario', flex: 1 },
		{
			field: 'activo',
			headerName: 'Estado',
			flex: 1.3,
			sortable: false,
			renderCell: ({ row }) => {
				const { id, activo } = row;
				return (
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							width: '100%',
							gap: 1,
						}}
					>
						<Box
							sx={{
								display: 'flex',
								alignItems: 'center',
								gap: 1,
								minWidth: 120,
							}}
						>
							<Box
								sx={{
									width: 10,
									height: 10,
									borderRadius: '50%',
									backgroundColor: activo ? 'green' : 'gray',
								}}
							/>
							<span>{activo ? 'Activo' : 'Desactivado'}</span>
						</Box>
						<Switch
							checked={activo}
							onChange={() => toggleActivo(id)}
							size='small'
						/>
					</Box>
				);
			},
		},
		{
			field: 'acciones',
			headerName: 'Acciones',
			flex: 1.2,
			sortable: false,
			renderCell: ({ row }) => (
				<Button
					variant='contained'
					color='primary'
					size='small'
					startIcon={<EditIcon />}
					onClick={() => handleEditUser(row)}
				>
					Editar
				</Button>
			),
		},
	];

	const rows = users.map((user, index) => ({
		...user,
		id: user.id || index,
		toggleActivo,
	}));

	return (
		<Box>
			<Box sx={{ mb: 2 }}>
				<Button
					variant='contained'
					startIcon={<AddIcon />}
					onClick={handleAddUserClick}
				>
					Agregar Usuario
				</Button>
			</Box>

			<Box
				sx={{
					width: '100%',
					minWidth: '1000px',
					maxWidth: '100%',
					overflowX: 'auto',
					height: 600,
					backgroundColor: '#fff',
					boxShadow: 2,
					borderRadius: 2,
				}}
			>
				<DataGrid
					rows={rows}
					columns={getColumns(toggleActivo, handleEditUser)}
					pageSize={5}
					rowsPerPageOptions={[5, 10, 20]}
				/>
			</Box>

			<Dialog open={openDeleteDialog} onClose={handleCancelDelete}>
				<DialogTitle>¿Eliminar usuario?</DialogTitle>
				<DialogContent>
					<DialogContentText>
						¿Estás seguro de eliminar al usuario{' '}
						<strong>{selectedUser?.nombre}</strong>? Esta acción no se puede
						deshacer.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCancelDelete}>Cancelar</Button>
					<Button
						onClick={handleConfirmDelete}
						variant='contained'
						color='error'
					>
						Sí, eliminar
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
};

export default UsersTable;
