import React, { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Switch,
	Typography,
	Stack,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

const CellStackRender = ({ children }) => (
	<Stack direction='row' spacing={1} alignItems='center'>
		{children}
	</Stack>
);

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
	const defaultColDef = useMemo(
		() => ({
			filter: true,
			floatingFilter: true,
			sortable: true,
			resizable: true,
		}),
		[]
	);

	const colDefs = useMemo(
		() => [
			{ field: 'nombre', headerName: 'Nombre', flex: 1 },
			{ field: 'apellidoPaterno', headerName: 'Apellido Paterno', flex: 1 },
			{ field: 'apellidoMaterno', headerName: 'Apellido Materno', flex: 1 },
			{ field: 'telefono', headerName: 'Teléfono', flex: 1 },
			{ field: 'usuario', headerName: 'Usuario', flex: 1 },
			{
				field: 'activo',
				headerName: 'Estado',
				flex: 1.3,
				cellRenderer: ({ data }) => (
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							width: '100%',
							gap: 1,
						}}
					>
						<CellStackRender>
							<Box
								sx={{
									width: 10,
									height: 10,
									borderRadius: '50%',
									backgroundColor: data.activo ? 'green' : 'gray',
								}}
							/>
							<Typography variant='body2'>
								{data.activo ? 'Activo' : 'Desactivado'}
							</Typography>
						</CellStackRender>
						<Switch
							checked={data.activo}
							onChange={() => toggleActivo(data.id)}
							size='small'
						/>
					</Box>
				),
			},
			{
				field: 'acciones',
				headerName: 'Acciones',
				flex: 1,
				cellRenderer: ({ data }) => (
					<Button
						variant='contained'
						color='primary'
						size='small'
						startIcon={<EditIcon />}
						onClick={() => handleEditUser(data)}
					>
						Editar
					</Button>
				),
			},
		],
		[handleEditUser, toggleActivo]
	);

	const rows = users.map((user, index) => ({
		...user,
		id: user.id || index,
	}));

	return (
		<Box>
			<Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
				<Button
					variant='contained'
					startIcon={<AddIcon />}
					onClick={handleAddUserClick}
				>
					Agregar Usuario
				</Button>
			</Box>

			<div
				className='ag-theme-quartz'
				style={{
					width: '100%',
					height: 'calc(100vh - 200px)',
				}}
			>
				<AgGridReact
					rowData={rows}
					columnDefs={colDefs}
					defaultColDef={defaultColDef}
					pagination={true}
					paginationAutoPageSize={true}
					animateRows={true}
				/>
			</div>

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
