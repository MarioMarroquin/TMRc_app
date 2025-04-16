import React from 'react';
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Box,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import UndoIcon from '@mui/icons-material/Undo';
import DeleteIcon from '@mui/icons-material/Delete';

const CompleteList = ({
	CompleteList,
	handleUndoCompleted,
	handleDeleteCompletedClick,
	handleConfirmCompletedDelete,
	handleCancelCompletedDelete,
	openCompletedDeleteDialog,
	selectedCompletedItem,
}) => {
	// Columnas para el DataGrid
	const columns = [
		{ field: 'FOLIO', headerName: 'Folio', flex: 1 },
		{ field: 'SERVICIO', headerName: 'Servicio', flex: 1.5 },
		{ field: 'EMPRESA', headerName: 'Empresa', flex: 1.5 },
		{ field: 'CLIENTE', headerName: 'Cliente', flex: 1.5 },
		{ field: 'CONTACT', headerName: 'Contacto', flex: 1.5 },
		{
			flex: 1.5,
			sortable: false,
			filterable: false,
			renderCell: (params) => (
				<Box sx={{ display: 'flex', gap: 0.5 }}>
					<Button
						variant='contained'
						size='small'
						startIcon={<UndoIcon />}
						onClick={() => handleUndoCompleted(params.row)}
						sx={{
							minWidth: 'auto',
							fontSize: '0.7rem',
							padding: '3px 6px',
						}}
					>
						Deshacer
					</Button>
					<Button
						variant='contained'
						color='error'
						size='small'
						startIcon={<DeleteIcon />}
						onClick={() => handleDeleteCompletedClick(params.row)}
						sx={{
							minWidth: 'auto',
							fontSize: '0.7rem',
							padding: '3px 6px',
						}}
					>
						Eliminar
					</Button>
				</Box>
			),
		},
	];

	const rows = CompleteList.map((item, index) => ({
		...item,
		id: item.id || `${item.FOLIO}-${index}`,
	}));

	return (
		<>
			<Box sx={{ height: 590, width: '100%' }}>
				<DataGrid
					rows={rows}
					columns={columns}
					pageSize={5}
					rowsPerPageOptions={[5, 10, 20]}
					disableSelectionOnClick
					initialState={{
						sorting: {
							sortModel: [{ field: 'FECHA', sort: 'asc' }],
						},
					}}
				/>
			</Box>

			{/* Dialog para eliminar confirmación */}
			<Dialog
				open={openCompletedDeleteDialog}
				onClose={handleCancelCompletedDelete}
			>
				<DialogTitle>¿Eliminar recordatorio?</DialogTitle>
				<DialogContent>
					<DialogContentText>
						¿Estás seguro de eliminar este recordatorio ? Esta acción no se
						puede deshacer.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCancelCompletedDelete}>Cancelar</Button>
					<Button
						onClick={handleConfirmCompletedDelete}
						variant='contained'
						color='error'
					>
						Sí, borrar
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default CompleteList;
