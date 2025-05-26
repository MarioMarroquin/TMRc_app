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
	handleDeleteCompletedClick,
	handleConfirmCompletedDelete,
	handleCancelCompletedDelete,
	openCompletedDeleteDialog,
	selectedCompletedItem,
	columns,
	setColumns,
	listData,
	setListData,
}) => {
	const handleUndoClick = (rowData) => {
		try {
			console.log('Datos del recordatorio a restaurar:', rowData);

			// Intentar obtener la fecha de todas las posibles fuentes
			let fecha = rowData.originalDate || rowData.FECHA;

			if (!fecha && rowData.completedDate) {
				// Si no tenemos fecha original, usamos la fecha de completado
				fecha = new Date(rowData.completedDate).toLocaleDateString('es-ES', {
					day: '2-digit',
					month: '2-digit',
					year: 'numeric',
				});
			}

			// Si aún no hay fecha, intentar obtenerla del description
			if (!fecha && rowData.description) {
				[fecha] = rowData.description.split(' - ');
			}

			if (!fecha) {
				// Como último recurso, usar la fecha actual
				fecha = new Date().toLocaleDateString('es-ES', {
					day: '2-digit',
					month: '2-digit',
					year: 'numeric',
				});
			}

			// Crear el objeto con todos los campos necesarios
			const listItem = {
				id: rowData.id,
				FOLIO: rowData.FOLIO || rowData.folio || '',
				SERVICIO: rowData.SERVICIO || rowData.title || '',
				EMPRESA: rowData.EMPRESA || rowData.empresa || '',
				CLIENTE: rowData.CLIENTE || rowData.cliente || '',
				CONTACT: rowData.CONTACT || rowData.contact || '',
				HORA: rowData.HORA || '',
				type: rowData.type || 'lead',
				FECHA: fecha,
			};

			// Actualizar listData
			setListData((prevListData) => {
				const newListData = [...prevListData];
				const existingGroupIndex = newListData.findIndex(
					(group) => group.FECHA === fecha
				);

				if (existingGroupIndex !== -1) {
					newListData[existingGroupIndex].LIST.push(listItem);
				} else {
					newListData.push({
						FECHA: fecha,
						LIST: [listItem],
					});
				}

				localStorage.setItem('listData', JSON.stringify(newListData));
				return newListData;
			});

			// Determinar columna Kanban
			const today = new Date();
			today.setHours(0, 0, 0, 0);

			let targetColumn = 'POR VENCER';
			try {
				const [day, month, year] = fecha.split('/');
				const itemDate = new Date(year, month - 1, day);
				itemDate.setHours(0, 0, 0, 0);

				if (itemDate < today) {
					targetColumn = 'VENCIDO';
				} else if (itemDate.getTime() === today.getTime()) {
					targetColumn = 'HOY';
				}
			} catch (e) {
				console.warn('Error al procesar la fecha para columna Kanban:', e);
			}

			// Actualizar columnas Kanban
			setColumns((prevColumns) => {
				const newColumns = { ...prevColumns };
				const kanbanItem = {
					id: rowData.id,
					title: listItem.SERVICIO,
					description: `${fecha} - ${listItem.HORA}`,
					type: listItem.type,
					empresa: listItem.EMPRESA,
					cliente: listItem.CLIENTE,
					contact: listItem.CONTACT,
					folio: listItem.FOLIO,
				};

				if (!newColumns[targetColumn]) {
					newColumns[targetColumn] = [];
				}
				newColumns[targetColumn].push(kanbanItem);
				localStorage.setItem('kanbanColumns', JSON.stringify(newColumns));
				return newColumns;
			});

			// Remover de completedList
			setCompletedList((prevList) => {
				const newList = prevList.filter((item) => item.id !== rowData.id);
				localStorage.setItem('completedList', JSON.stringify(newList));
				return newList;
			});

			toast.success('✔️ Recordatorio restaurado correctamente');
		} catch (error) {
			console.error('Error detallado:', error);
			toast.error(`Error al restaurar: ${error.message}`);
		}
	};

	const gridColumns = [
		{ field: 'FOLIO', headerName: 'Folio', flex: 1 },
		{ field: 'SERVICIO', headerName: 'Servicio', flex: 1.5 },
		{ field: 'EMPRESA', headerName: 'Empresa', flex: 1.5 },
		{ field: 'CLIENTE', headerName: 'Cliente', flex: 1.5 },
		{ field: 'CONTACT', headerName: 'Contacto', flex: 1.5 },
		{
			field: 'originalDate',
			headerName: 'Fecha Original',
			flex: 1.5,
			valueGetter: (params) => {
				return (
					params.row.originalDate ||
					params.row.FECHA ||
					(params.row.description ? params.row.description.split(' - ')[0] : '')
				);
			},
		},
		{
			field: 'completedDate',
			headerName: 'Fecha Completado',
			flex: 1.5,
			valueFormatter: (params) => {
				if (!params.value) return '';
				return new Date(params.value).toLocaleDateString('es-ES', {
					day: '2-digit',
					month: '2-digit',
					year: 'numeric',
				});
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

	return (
		<>
			<Box sx={{ height: 590, width: '100%' }}>
				<DataGrid
					rows={completedList || []}
					columns={gridColumns}
					pageSize={5}
					rowsPerPageOptions={[5, 10, 20]}
					disableSelectionOnClick
					getRowId={(row) => row.id}
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
