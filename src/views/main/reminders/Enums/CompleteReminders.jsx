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
import toast from 'react-hot-toast';

const CompleteList = ({
	completedList,
	setCompletedList,
	listData,
	setListData,
	columns: kanbanColumns, // Renombramos la prop
	setColumns,
	handleUndoCompleted,
	handleDeleteCompletedClick,
	handleConfirmCompletedDelete,
	handleCancelCompletedDelete,
	openCompletedDeleteDialog,
	selectedCompletedItem,
}) => {
	const handleUndoClick = (rowData) => {
		try {
			// 1. Remover de completedList
			const newCompletedList = completedList.filter(
				(completedItem) => completedItem.id !== rowData.id
			);
			setCompletedList(newCompletedList);

			// 2. Restaurar a listData
			const itemToRestore = {
				...rowData,
				completedDate: undefined,
			};

			setListData((prevListData) => {
				const existingGroup = prevListData.find(
					(group) => group.FECHA === rowData.FECHA
				);

				if (existingGroup) {
					return prevListData.map((group) =>
						group.FECHA === rowData.FECHA
							? { ...group, LIST: [...group.LIST, itemToRestore] }
							: group
					);
				} else {
					return [
						...prevListData,
						{ FECHA: rowData.FECHA, LIST: [itemToRestore] },
					];
				}
			});

			// 3. Restaurar a la columna correspondiente en Kanban
			setColumns((prevColumns) => {
				const newColumns = { ...prevColumns };
				const firstColumnId = Object.keys(newColumns)[0];
				newColumns[firstColumnId] = [
					...(newColumns[firstColumnId] || []),
					itemToRestore,
				];
				return newColumns;
			});

			toast.success('✔️ Recordatorio restaurado');
		} catch (error) {
			console.error('Error al deshacer completado:', error);
			toast.error('Error al restaurar el recordatorio');
		}
	};

	// Definición de las columnas para el DataGrid
	const gridColumns = [
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
						onClick={() => handleUndoClick(params.row)}
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

	const rows =
		completedList?.map((item, index) => ({
			...item,
			id: item.id || `${item.FOLIO}-${index}`,
		})) || [];

	return (
		<>
			<Box sx={{ height: 590, width: '100%' }}>
				<DataGrid
					rows={rows}
					columns={gridColumns}
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

			<Dialog
				open={openCompletedDeleteDialog}
				onClose={handleCancelCompletedDelete}
			>
				<DialogTitle>¿Eliminar recordatorio?</DialogTitle>
				<DialogContent>
					<DialogContentText>
						¿Estás seguro de eliminar este recordatorio? Esta acción no se puede
						deshacer.
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
