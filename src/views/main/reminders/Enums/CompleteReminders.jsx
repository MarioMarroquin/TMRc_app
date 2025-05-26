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
			// Obtener la fecha del registro completado
			let fecha;

			// Si el registro viene de Kanban, estará en un formato diferente
			if (rowData.description) {
				fecha = rowData.description.split(' - ')[0];
			} else {
				// Intentar obtener la fecha de diferentes propiedades
				fecha = rowData.FECHA || rowData.fecha || rowData.originalDate;
			}

			// Si aún no tenemos fecha, intentar crearla desde completedDate
			if (!fecha && rowData.completedDate) {
				const completedDate = new Date(rowData.completedDate);
				const day = completedDate.getDate().toString().padStart(2, '0');
				const month = (completedDate.getMonth() + 1)
					.toString()
					.padStart(2, '0');
				const year = completedDate.getFullYear();
				fecha = `${day}/${month}/${year}`;
			}

			if (!fecha) {
				throw new Error('No se pudo determinar la fecha del recordatorio');
			}

			// Crear el objeto para listData con los datos existentes
			const listItem = {
				id: rowData.id,
				FOLIO: rowData.FOLIO || '',
				SERVICIO: rowData.SERVICIO || '',
				EMPRESA: rowData.EMPRESA || '',
				CLIENTE: rowData.CLIENTE || '',
				CONTACT: rowData.CONTACT || '',
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

				// Guardar en localStorage
				localStorage.setItem('listData', JSON.stringify(newListData));
				return newListData;
			});

			// Determinar la columna Kanban
			const today = new Date();
			today.setHours(0, 0, 0, 0);

			const [day, month, year] = fecha.split('/');
			const itemDate = new Date(year, month - 1, day);
			itemDate.setHours(0, 0, 0, 0);

			let targetColumn = 'POR VENCER';
			const timeDiff = itemDate.getTime() - today.getTime();
			const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

			if (dayDiff < 0) {
				targetColumn = 'VENCIDO';
			} else if (dayDiff === 0) {
				targetColumn = 'HOY';
			}

			// Actualizar columnas Kanban
			setColumns((prevColumns) => {
				const newColumns = JSON.parse(JSON.stringify(prevColumns));
				const kanbanItem = {
					id: rowData.id,
					title: listItem.SERVICIO,
					description: `${fecha} - ${listItem.HORA}`,
					type: listItem.type,
					empresa: listItem.EMPRESA,
					cliente: listItem.CLIENTE,
					contact: listItem.CONTACT,
					folio: listItem.FOLIO,
					originalDate: fecha,
				};

				if (!newColumns[targetColumn]) {
					newColumns[targetColumn] = [];
				}

				// Remover el item de todas las columnas para evitar duplicados
				Object.keys(newColumns).forEach((columnKey) => {
					newColumns[columnKey] = newColumns[columnKey].filter(
						(item) => item.id !== rowData.id
					);
				});

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
			console.error('Error completo:', error);
			console.error('Datos del registro que causó el error:', rowData);
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
			flex: 2, // Aumentado el flex para dar más espacio
			minWidth: 200, // Ancho mínimo para asegurar que los botones quepan
			sortable: false,
			filterable: false,
			renderCell: (params) => (
				<Box
					sx={{
						display: 'flex',
						gap: 1,
						width: '100%',
						justifyContent: 'center',
						'& .MuiButton-root': {
							whiteSpace: 'nowrap',
							minWidth: 'auto',
						},
					}}
				>
					<Button
						variant='contained'
						size='small'
						startIcon={<UndoIcon />}
						onClick={() => handleUndoClick(params.row)}
						sx={{
							fontSize: '0.75rem',
							padding: '4px 8px',
							height: '28px',
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
							fontSize: '0.75rem',
							padding: '4px 8px',
							height: '28px',
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
					sx={{
						'& .MuiDataGrid-cell': {
							padding: '8px',
						},
						'& .MuiDataGrid-columnHeader': {
							padding: '8px',
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
