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
	handleUndoCompleted,
	handleDeleteCompletedClick,
	handleConfirmCompletedDelete,
	handleCancelCompletedDelete,
	openCompletedDeleteDialog,
	selectedCompletedItem,
	columns,
	setColumns,
}) => {
	const handleUndoClick = (rowData) => {
		try {
			// 1. Remover de completedList
			const newCompletedList = completedList.filter(
				(completedItem) => completedItem.id !== rowData.id
			);
			setCompletedList(newCompletedList);

			// 2. Determinar la columna apropiada basada en la fecha
			const today = new Date();
			today.setHours(0, 0, 0, 0);

			const itemDate = new Date(rowData.FECHA.split('/').reverse().join('-'));
			itemDate.setHours(0, 0, 0, 0);

			let targetColumn = 'POR VENCER';
			if (itemDate < today) {
				targetColumn = 'VENCIDO';
			} else if (itemDate.getTime() === today.getTime()) {
				targetColumn = 'HOY';
			}

			// 3. Preparar el item para Kanban
			const kanbanItem = {
				id: rowData.id,
				title: rowData.SERVICIO,
				description: rowData.FECHA + (rowData.HORA ? ` - ${rowData.HORA}` : ''),
				type: rowData.type || 'lead',
				empresa: rowData.EMPRESA,
				cliente: rowData.CLIENTE,
				contact: rowData.CONTACT,
				folio: rowData.FOLIO,
			};

			// 4. Preparar el item para List
			const listItem = {
				id: rowData.id,
				FOLIO: rowData.FOLIO,
				SERVICIO: rowData.SERVICIO,
				EMPRESA: rowData.EMPRESA,
				CLIENTE: rowData.CLIENTE,
				CONTACT: rowData.CONTACT,
				HORA: rowData.HORA,
				type: rowData.type || 'lead',
			};

			// 5. Actualizar listData
			setListData((prevListData) => {
				const existingGroup = prevListData.find(
					(group) => group.FECHA === rowData.FECHA
				);

				if (existingGroup) {
					return prevListData.map((group) =>
						group.FECHA === rowData.FECHA
							? { ...group, LIST: [...group.LIST, listItem] }
							: group
					);
				} else {
					return [...prevListData, { FECHA: rowData.FECHA, LIST: [listItem] }];
				}
			});

			// 6. Actualizar Kanban
			setColumns((prevColumns) => {
				const newColumns = { ...prevColumns };
				newColumns[targetColumn] = [
					...(newColumns[targetColumn] || []),
					kanbanItem,
				];
				return newColumns;
			});

			// 7. Actualizar localStorage
			localStorage.setItem('completedList', JSON.stringify(newCompletedList));

			// 8. Disparar eventos de actualización
			window.dispatchEvent(
				new CustomEvent('listDataUpdate', { detail: listData })
			);
			window.dispatchEvent(
				new CustomEvent('kanbanUpdate', { detail: columns })
			);

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
			field: 'completedDate',
			headerName: 'Fecha Completado',
			flex: 1.5,
			valueFormatter: (params) => {
				if (!params.value) return '';
				return new Date(params.value).toLocaleString('es-ES');
			},
		},
		{
			field: 'actions',
			headerName: 'Acciones',
			flex: 1.5,
			sortable: false,
			filterable: false,
			renderCell: (params) => (
				<Box sx={{ display: 'flex', gap: 0.5 }}>
					<Button
						variant='contained'
						size='small'
						startIcon={<UndoIcon />}
						onClick={() => handleUndoCompleted(params.row)} // Usar el prop en lugar de handleUndoClick
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

	return (
		<>
			<Box sx={{ height: 590, width: '100%' }}>
				<DataGrid
					rows={completedList || []}
					columns={gridColumns}
					pageSize={5}
					rowsPerPageOptions={[5, 10, 20]}
					disableSelectionOnClick
					initialState={{
						sorting: {
							sortModel: [{ field: 'completedDate', sort: 'desc' }],
						},
					}}
					getRowId={(row) => row.id} // Asegura que cada fila tenga un ID único
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
