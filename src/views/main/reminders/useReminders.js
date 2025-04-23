import { useQuery } from '@apollo/client';
import { GET_LEAD_REMINDERS } from './queryLeadReminders';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { reminderData } from '@views/main/reminders/ReminderData.js';

const convertToDate = (dateString) => {
	if (!dateString || typeof dateString !== 'string') return new Date(); // o retorna null si prefieres

	const [day, month, year] = dateString.split('/');
	return new Date(`${year}-${month}-${day}`);
};

export const sortRemindersByDate = (reminders) => {
	return reminders.sort((a, b) => {
		const dateA = convertToDate(a.description);
		const dateB = convertToDate(b.description);
		return dateB - dateA;
	});
};

export const useReminders = () => {
	const [openDialog, setOpenDialog] = useState(false);
	const [selectedItem, setSelectedItem] = useState(null);
	const [openCompletedDeleteDialog, setOpenCompletedDeleteDialog] =
		useState(false);
	const [selectedCompletedItem, setSelectedCompletedItem] = useState(null);
	const [openDeleteAllDialog, setOpenDeleteAllDialog] = useState(false);
	const [reminderDataState, setReminderDataState] = useState(() => {
		const saved = localStorage.getItem('reminderData');
		return saved ? JSON.parse(saved) : reminderData; // fallback al archivo estático
	});
	const [draggingId, setDraggingId] = useState(null);
	const [draggingColumnId, setDraggingColumnId] = useState(null);

	const [reminders, setReminders] = useState(() => {
		const storedData = localStorage.getItem('reminders');
		return storedData ? JSON.parse(storedData) : reminderData;
	});

	const handleOpenDeleteAllDialog = () => {
		setOpenDeleteAllDialog(true);
	};

	const handleCloseDeleteAllDialog = () => {
		setOpenDeleteAllDialog(false);
	};

	const [completedList, setCompletedList] = useState(() => {
		const saved = localStorage.getItem('completedList');
		return saved ? JSON.parse(saved) : [];
	});

	useEffect(() => {
		localStorage.setItem('completedList', JSON.stringify(completedList));
	}, [completedList]);

	const [selectedView, setSelectedView] = useState(() => {
		const saved = localStorage.getItem('selectedView');
		return saved;
	});

	useEffect(() => {
		localStorage.setItem('selectedView', selectedView);
	}, [selectedView]);

	const currentData = reminderDataState[selectedView] || [];
	const [listData, setListData] = useState(currentData);
	const [columns, setColumns] = useState({});
	const [openEditDialog, setOpenEditDialog] = useState(false);
	const [itemToEdit, setItemToEdit] = useState(null);

	const [deletedItems, setDeletedItems] = useState(() => {
		const stored = localStorage.getItem('deletedItems');
		return stored ? JSON.parse(stored) : [];
	});

	useEffect(() => {
		localStorage.setItem('deletedItems', JSON.stringify(deletedItems));
	}, [deletedItems]);

	useEffect(() => {
		const currentData = reminderDataState[selectedView] || [];

		const completedLocal =
			JSON.parse(localStorage.getItem('completedList')) || [];
		const deletedLocal = JSON.parse(localStorage.getItem('deletedItems')) || [];

		const completedIds = completedLocal.map((item) => item.id);
		const deletedIds = deletedLocal;

		const filteredData = currentData
			.map((group) => ({
				...group,
				LIST: group.LIST.filter(
					(item) =>
						!completedIds.includes(item.id) && !deletedIds.includes(item.id)
				),
			}))
			.filter((group) => group.LIST.length > 0);

		setListData(filteredData);

		const kanbanColumns = formatReminderDataForKanban(
			reminderDataState,
			completedIds,
			deletedIds
		);
		setColumns(kanbanColumns);
	}, [selectedView, completedList, deletedItems, reminderDataState]);

	const ListoClick = (item, fechaOriginal) => {
		const updatedListData = listData
			.map((group) => {
				if (group.FECHA === fechaOriginal) {
					return {
						...group,
						LIST: group.LIST.filter((i) => i.id !== item.id),
					};
				}
				return group;
			})
			.filter((group) => group.LIST.length > 0); // Quita grupos vacíos

		const today = new Date().toISOString().split('T')[0];
		const itemDate = new Date(fechaOriginal).toISOString().split('T')[0];
		let origen = 'pasado';
		if (itemDate === today) origen = 'hoy';

		const updatedCompletedList = [...completedList, { ...item, origen }];

		setListData(updatedListData);
		setCompletedList(updatedCompletedList);
		localStorage.setItem('listData', JSON.stringify(updatedListData));
		localStorage.setItem('completedList', JSON.stringify(updatedCompletedList));
	};

	const handleDeleteClick = (item) => {
		setSelectedItem(item);
		setOpenDialog(true);
	};

	const handleConfirmDelete = () => {
		if (!selectedItem) return;

		// Obtener eliminados actuales
		const deletedLocal = JSON.parse(localStorage.getItem('deletedItems')) || [];

		// Agregar el item a los eliminados
		const updatedDeleted = [...deletedLocal, selectedItem.id];
		localStorage.setItem('deletedItems', JSON.stringify(updatedDeleted));

		// Eliminar el item de listData
		setListData((prevData) =>
			prevData
				.map((group) => ({
					...group,
					LIST: group.LIST.filter((item) => item.id !== selectedItem.id),
				}))
				.filter((group) => group.LIST.length > 0)
		);

		setOpenDialog(false);
		setSelectedItem(null);
		toast.error(' 🗑️ Recordatorio eliminado');
	};

	const handleCancelDelete = () => {
		setOpenDialog(false);
		setSelectedItem(null);
	};
	const getToday = () => {
		const today = new Date();
		const dd = today.getDate();
		const mm = today.getMonth() + 1;
		const yyyy = today.getFullYear();
		return `${dd}/${mm}/${yyyy}`;
	};

	const formatReminderDataForKanban = (
		reminderData,
		completedIds = [],
		deletedIds = []
	) => {
		const columnsFormatted = {
			VENCIDO: [],
			HOY: [],
			'POR VENCER': [],
		};

		// Helper para formatear fecha
		const formatDate = (fechaStr) => {
			const [year, month, day] = fechaStr.split('/');
			return `${day}/${month}/${year}`;
		};

		// Mapea datos de cada sección (pasado, hoy, futuro)
		['pasado', 'hoy', 'porVencer'].forEach((key) => {
			(reminderData[key] || []).forEach((grupo) => {
				const formattedDate = formatDate(grupo.FECHA);
				grupo.LIST.forEach((item) => {
					if (
						!completedIds.includes(item.id) &&
						!deletedIds.includes(item.id)
					) {
						columnsFormatted[
							key === 'pasado'
								? 'VENCIDO'
								: key === 'hoy'
								? 'HOY'
								: 'POR VENCER'
						].push({
							id: item.FOLIO,
							title: item.SERVICIO,
							description: formattedDate,
						});
					}
				});
			});
		});

		return columnsFormatted;
	};

	useEffect(() => {
		// Inicializamos los recordatorios con los datos de reminderData
		const data = {
			pasado: reminderData.pasado.flatMap((group) => group.LIST),
			hoy: reminderData.hoy.flatMap((group) => group.LIST),
			// Puedes agregar más estados si es necesario
		};

		setReminders(data);

		// Sincronizamos con localStorage si es necesario
		localStorage.setItem('reminders', JSON.stringify(data));
	}, []);

	const findReminderStatusById = (id) => {
		for (const [status, list] of Object.entries(columns)) {
			if (list.find((item) => item.id === id)) {
				return status;
			}
		}
		return null;
	};

	const moveReminder = (reminderId, destinationId) => {
		const sourceId = findReminderStatusById(reminderId);
		if (!sourceId || sourceId === destinationId) return;

		const sourceColumn = [...columns[sourceId]];
		const destColumn = [...columns[destinationId]];
		const sourceIndex = sourceColumn.findIndex(
			(item) => item.id === reminderId
		);

		if (sourceIndex === -1) return;

		const [movedItem] = sourceColumn.splice(sourceIndex, 1);
		const destinationIndex = 0;

		destColumn.splice(destinationIndex, 0, movedItem);

		const updatedColumns = {
			...columns,
			[sourceId]: sourceColumn,
			[destinationId]: destColumn,
		};

		setColumns(updatedColumns);
		localStorage.setItem('kanbanColumns', JSON.stringify(updatedColumns));

		const updatedReminderData = { ...reminderDataState };

		// Limpiar de todos los grupos anteriores
		Object.keys(updatedReminderData).forEach((key) => {
			updatedReminderData[key] = updatedReminderData[key]
				.map((group) => ({
					...group,
					LIST: group.LIST.filter((item) => item.FOLIO !== movedItem.id),
				}))
				.filter((group) => group.LIST.length > 0);
		});

		// Obtener nueva fecha desde el description (usada como fecha en tu lógica)
		let newFechaRaw = movedItem.description?.split('/').reverse().join('/');

		if (destinationId === 'POR VENCER') {
			const today = new Date();
			const day = String(today.getDate()).padStart(2, '0');
			const month = String(today.getMonth() + 1).padStart(2, '0');
			const year = today.getFullYear();
			const newFecha = `${day}/${month}/${year}`;
			newFechaRaw = `${year}/${month}/${day}`;
			movedItem.description = newFecha;
		}

		const newItem = {
			FOLIO: movedItem.id,
			SERVICIO: movedItem.title,
			FECHA: newFechaRaw,
		};

		const destKey =
			destinationId === 'POR VENCER'
				? 'porVencer'
				: destinationId.toLowerCase(); // 'hoy' o 'vencido'

		if (!updatedReminderData[destKey]) updatedReminderData[destKey] = [];

		const existingGroupIndex = updatedReminderData[destKey].findIndex(
			(group) => group.FECHA === newFechaRaw
		);

		if (existingGroupIndex !== -1) {
			updatedReminderData[destKey][existingGroupIndex].LIST.push(newItem);
		} else {
			updatedReminderData[destKey].push({
				FECHA: newFechaRaw,
				LIST: [newItem],
			});
		}

		setReminderDataState(updatedReminderData);
		localStorage.setItem('reminderData', JSON.stringify(updatedReminderData));

		toast.success('💾 Guardado');
	};

	const onDragEnd = (result) => {
		const { source, destination } = result;

		if (!destination) return;

		if (
			source.droppableId === destination.droppableId &&
			source.index === destination.index
		) {
			return;
		}

		moveReminder(
			source.droppableId,
			destination.droppableId,
			source.index,
			destination.index
		);
	};

	const handleEditClick = (item, fecha) => {
		console.log('EDITAR:', item, fecha);
		setItemToEdit({ ...item, FECHA: fecha });
		setOpenEditDialog(true);
	};

	// Función para cerrar el diálogo sin guardar
	const handleCancelEdit = () => {
		setOpenEditDialog(false);
		setItemToEdit(null);
	};

	// Función para guardar los cambios
	const handleSaveEdit = () => {
		if (!itemToEdit) return;

		const updatedListData = listData.map((group) =>
			group.FECHA === itemToEdit.FECHA
				? {
						...group,
						LIST: group.LIST.map((task) =>
							task.id === itemToEdit.id ? itemToEdit : task
						),
				  }
				: group
		);

		setListData(updatedListData);
		setOpenEditDialog(false);
		toast.success('📝 Recordatorio actualizado');
	};
	const handleDeleteAll = () => {
		// Eliminamos todos los items que están en la sección "Listo" (es decir, en completedList)
		const toDeleteIds = completedList.map((item) => item.id);

		// Actualizamos lista de eliminados
		const updatedDeletedItems = [...deletedItems, ...toDeleteIds];
		setDeletedItems(updatedDeletedItems);
		localStorage.setItem('deletedItems', JSON.stringify(updatedDeletedItems));

		// Limpiamos la sección "Listo"
		setCompletedList([]);
		localStorage.setItem('completedList', JSON.stringify([]));

		toast.success('🗑️ Todos los recordatorios completados han sido eliminados');
	};

	const handleUndoCompleted = (item) => {
		const updatedCompleted = completedList.filter((i) => i.id !== item.id);

		const updatedList = [...listData];
		const index = updatedList.findIndex((group) => group.FECHA === item.FECHA);

		if (index >= 0) {
			updatedList[index].LIST.push(item);
		} else {
			updatedList.push({ FECHA: item.FECHA, LIST: [item] });
		}

		setCompletedList(updatedCompleted);
		setListData(updatedList);
		localStorage.setItem('completedList', JSON.stringify(updatedCompleted));
		localStorage.setItem('listData', JSON.stringify(updatedList));
	};
	const handleDeleteCompletedClick = (item) => {
		setSelectedCompletedItem(item);
		setOpenCompletedDeleteDialog(true);
	};

	const handleCancelCompletedDelete = () => {
		setOpenCompletedDeleteDialog(false);
		setSelectedCompletedItem(null);
	};

	const handleConfirmCompletedDelete = () => {
		if (!selectedCompletedItem) return;

		const updatedCompleted = completedList.filter(
			(item) => item.id !== selectedCompletedItem.id
		);

		const updatedDeletedItems = [...deletedItems, selectedCompletedItem.id];
		setDeletedItems(updatedDeletedItems);
		localStorage.setItem('deletedItems', JSON.stringify(updatedDeletedItems));

		setCompletedList(updatedCompleted);
		localStorage.setItem('completedList', JSON.stringify(updatedCompleted));

		setOpenCompletedDeleteDialog(false);
		setSelectedCompletedItem(null);

		toast.error('🗑️ Recordatorio eliminado');
	};

	const handleDragStart = (event, reminderId, columnId) => {
		setDraggingId(reminderId);
		setDraggingColumnId(columnId);
		event.dataTransfer.setData('reminderId', reminderId);
		event.dataTransfer.setData('sourceColumn', columnId);
		event.target.classList.add('dragging');
	};

	const handleDragEnd = (event) => {
		event.target.classList.remove('dragging');
		setDraggingId(null);
		setDraggingColumnId(null);
	};

	const handleDrop = (event, targetColumnId) => {
		const reminderId = event.dataTransfer.getData('reminderId');
		const sourceColumn = event.dataTransfer.getData('sourceColumn');

		if (sourceColumn !== targetColumnId) {
			moveReminder(reminderId, targetColumnId);
		}
	};

	const addReminderToColumn = (columnId, reminder) => {
		setColumns((prev) => {
			const updated = {
				...prev,
				[columnId]: [...prev[columnId], reminder],
			};
			localStorage.setItem('reminders', JSON.stringify(updated));
			return updated;
		});
	};

	return {
		listData,
		setListData,
		completedList,
		setCompletedList,
		ListoClick,
		handleDeleteClick,
		handleConfirmDelete,
		handleCancelDelete,
		openDialog,
		selectedItem,
		selectedView,
		setSelectedView,
		columns,
		setColumns,
		formatReminderDataForKanban,
		getToday,
		onDragEnd,
		handleCancelEdit,
		handleEditClick,
		handleSaveEdit,
		openEditDialog,
		itemToEdit,
		setItemToEdit,
		handleDeleteAll,
		handleUndoCompleted,
		handleDeleteCompletedClick,
		handleConfirmCompletedDelete,
		handleCancelCompletedDelete,
		openCompletedDeleteDialog,
		selectedCompletedItem,
		openDeleteAllDialog,
		handleOpenDeleteAllDialog,
		handleCloseDeleteAllDialog,
		reminders,
		moveReminder,
		handleDragStart,
		handleDragEnd,
		handleDrop,
		draggingColumnId,
		addReminderToColumn,
	};
};
