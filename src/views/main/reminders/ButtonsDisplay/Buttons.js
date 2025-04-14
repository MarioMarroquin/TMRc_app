import { useState } from 'react';

// Hook personalizado para eliminar un registro dentro de un conjunto de datos
const useEliminarFila = (data, setDataFor) => {
	const eliminarFila = (fechaId, folio) => {
		setDataFor((prevData) =>
			prevData.map((item) => {
				if (item.id === fechaId) {
					// Filtrar y eliminar el registro con el folio correspondiente
					return {
						...item,
						LIST: item.LIST.filter((registro) => registro.FOLIO !== folio),
					};
				}
				return item;
			})
		);
	};

	return eliminarFila;
};

const useConfirmDelete = (eliminarFila) => {
	const [openDialog, setOpenDialog] = useState(false);
	const [recordToDelete, setRecordToDelete] = useState(null);
	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [recordIdToDelete, setRecordIdToDelete] = useState(null);

	// Función para abrir el diálogo
	const handleOpenDialog = (id, record) => {
		setRecordToDelete(record); // Establecer el registro a eliminar
		setRecordIdToDelete(id);
		setOpenDialog(true); // Abrir el diálogo
	};

	const handleCloseDialog = () => {
		setOpenDialog(false);
		setRecordToDelete(null);
		setRecordIdToDelete(null);
	};

	// Función para confirmar la eliminación
	const handleConfirmDelete = () => {
		if (recordToDelete) {
			eliminarFila(recordIdToDelete, recordToDelete.FOLIO); // Llamar a la función para eliminar el registro
			setOpenSnackbar(true); // Mostrar el Snackbar de éxito
			setOpenDialog(false); // Cerrar el diálogo
			setRecordToDelete(null); // Limpiar el registro seleccionado
		}
	};

	return {
		openDialog,
		setOpenDialog,
		openSnackbar,
		setOpenSnackbar,
		handleOpenDialog,
		handleCloseDialog,
		handleConfirmDelete,
	};
};

export { useEliminarFila, useConfirmDelete };
