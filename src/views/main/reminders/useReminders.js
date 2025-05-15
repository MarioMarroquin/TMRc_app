import { useQuery } from '@apollo/client';
import { GET_LEAD_REMINDERS } from './queryLeadReminders';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { reminderData } from '@views/main/reminders/ReminderData.js';

const convertToDate = (dateString) => {
	if (!dateString || typeof dateString !== 'string') return new Date();

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

const extractDateFromDescription = (description) => {
	if (!description) return new Date(0); // fecha muy antigua por defecto
	const [dateStr] = description.split(' - ');
	const [dd, mm, yyyy] = dateStr.split('/');
	return new Date(`${yyyy}-${mm}-${dd}`);
};

const sortCardsByDate = (cards) => {
	return [...cards].sort((a, b) => {
		return (
			extractDateFromDescription(b.description) -
			extractDateFromDescription(a.description)
		);
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
	const [kanbanCompleted, setKanbanCompleted] = useState([]);
	const [tempRemovedItem, setTempRemovedItem] = useState(null);
	const [sourceColumnId, setSourceColumnId] = useState(null);

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

	// Esto se encuentra en tu hook 'useReminders' donde se gestiona el listado de recordatorios
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

		setListData(sortRemindersByDate(filteredData)); // Aplicamos el orden después de filtrar los datos

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

		// Actualizamos la lista de completados
		setListData(updatedListData);
		setCompletedList(updatedCompletedList);
		localStorage.setItem('listData', JSON.stringify(updatedListData));
		localStorage.setItem('completedList', JSON.stringify(updatedCompletedList));

		// Mover a Kanban
		const updatedColumns = { ...columns };
		updatedColumns['VENCIDO'].push({
			id: item.FOLIO,
			title: item.SERVICIO,
			description: fechaOriginal,
		});

		setColumns(updatedColumns);
		localStorage.setItem('kanbanColumns', JSON.stringify(updatedColumns));

		toast.success('✔️ Recordatorio movido a Listo');
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
					const hora = item.HORA || '08:00';
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
							description: `${formattedDate} - ${hora}`,
							type: item.type,
						});
					}
				});
			});
		});

		Object.keys(columnsFormatted).forEach((key) => {
			columnsFormatted[key] = sortCardsByDate(columnsFormatted[key]);
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

	const moveReminder = (reminderId, targetColumnId) => {
		const updatedColumns = { ...columns };
		let movedItem;

		// Encontrar y remover el recordatorio de su columna actual
		Object.keys(updatedColumns).forEach((columnId) => {
			const itemIndex = updatedColumns[columnId].findIndex(
				(item) => item.id.toString() === reminderId.toString()
			);
			if (itemIndex !== -1) {
				[movedItem] = updatedColumns[columnId].splice(itemIndex, 1);
			}
		});

		if (movedItem && targetColumnId === 'HOY') {
			// Actualizar la fecha al día de hoy
			const today = new Date();
			const formattedDate = `${String(today.getDate()).padStart(
				2,
				'0'
			)}/${String(today.getMonth() + 1).padStart(
				2,
				'0'
			)}/${today.getFullYear()}`;

			// Mantener la hora original
			const [_, originalTime] = movedItem.description.split(' - ');

			// Actualizar la descripción con la nueva fecha pero manteniendo la hora
			movedItem.description = `${formattedDate} - ${originalTime}`;
		}

		// Agregar el recordatorio a la columna destino
		if (!updatedColumns[targetColumnId]) {
			updatedColumns[targetColumnId] = [];
		}
		updatedColumns[targetColumnId].push(movedItem);
		updatedColumns[targetColumnId] = sortCardsByDate(
			updatedColumns[targetColumnId]
		);

		setColumns(updatedColumns);
		localStorage.setItem('kanbanColumns', JSON.stringify(updatedColumns));
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

	const handleEditClick = (item, fecha, columnId) => {
		setItemToEdit({
			...item,
			FECHA: fecha,
			columnId: columnId, // Asegúrate de pasar la columna
		});
		setOpenEditDialog(true);
	};

	// Función para cerrar el diálogo sin guardar
	const handleCancelEdit = () => {
		setOpenEditDialog(false);
		setItemToEdit(null);
	};

	// Función para guardar los cambios
	const handleSaveEdit = () => {
		if (!itemToEdit || !itemToEdit.id) return;

		const updatedList = listData.map((group) => {
			if (group.FECHA === itemToEdit.FECHA) {
				const updatedItems = group.LIST.map((item) =>
					item.id === itemToEdit.id ? itemToEdit : item
				);
				return { ...group, LIST: updatedItems };
			}
			return group;
		});

		setListData(updatedList);

		// Aquí, en lugar de usar una propiedad fija, usa itemToEdit.columnId
		const targetColumn = itemToEdit.columnId || 'POR VENCER';

		// Quitar el recordatorio de todas las columnas
		const updatedColumns = { ...columns };
		Object.keys(updatedColumns).forEach((colId) => {
			updatedColumns[colId] = updatedColumns[colId].filter(
				(item) => item.id !== itemToEdit.id
			);
		});

		// Insertar en la misma columna original
		if (!updatedColumns[targetColumn]) {
			updatedColumns[targetColumn] = [];
		}
		updatedColumns[targetColumn].push(itemToEdit); // No usar unshift si quieres mantener el orden
		updatedColumns[targetColumn] = sortCardsByDate(
			updatedColumns[targetColumn]
		);

		setColumns(updatedColumns);
		localStorage.setItem('kanbanColumns', JSON.stringify(updatedColumns));

		toast.success(`✅ Recordatorio actualizado en ${targetColumn}`);
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
		// 1. Quitar de completados
		const updatedCompleted = completedList.filter((r) => r.id !== item.id);
		setCompletedList(updatedCompleted);
		localStorage.setItem('kanbanCompleted', JSON.stringify(updatedCompleted));

		// 2. Restaurar en su columna original, o "HOY" si no existe
		const originalColumn = item.originalColumn || 'HOY';

		const updatedColumns = {
			...columns,
			[originalColumn]: [...(columns[originalColumn] || []), item],
		};
		setColumns(updatedColumns);
		localStorage.setItem('kanbanColumns', JSON.stringify(updatedColumns));

		// 3. Volver a insertar en listData (si aplica)
		const fecha = item.FECHA || 'SinFecha';
		const updatedList = [...listData];
		const existingFecha = updatedList.find((f) => f.FECHA === fecha);

		if (existingFecha) {
			existingFecha.LIST.push(item);
		} else {
			updatedList.push({ FECHA: fecha, LIST: [item] });
		}
		setListData(updatedList);
		localStorage.setItem('listData', JSON.stringify(updatedList));

		console.log('🔁 Deshecho y movido a:', originalColumn, item);
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

	const handleDragStart = (e, reminderId, columnId) => {
		e.dataTransfer.setData('reminderId', reminderId);
		e.target.style.transform = 'scale(1.05)'; // Aumenta ligeramente el tamaño de la tarjeta
		e.target.style.transition = 'transform 0.2s ease'; // Añade una transición suave
	};

	const handleDragEnd = (e) => {
		e.target.style.transform = '';
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
				[columnId]: sortCardsByDate([...prev[columnId], reminder]),
			};
			localStorage.setItem('reminders', JSON.stringify(updated));
			return updated;
		});
	};

	const deleteReminder = (id, columnId) => {
		const updatedColumns = {
			...columns,
			[columnId]: columns[columnId].filter((item) => item.id !== id),
		};
		setColumns(updatedColumns);
		localStorage.setItem('kanbanColumns', JSON.stringify(updatedColumns));
		toast.error('🗑️ Recordatorio eliminado');
	};

	const completeReminder = (reminder, columnId) => {
		// Eliminar del kanban
		const updatedColumns = {
			...columns,
			[columnId]: columns[columnId].filter((item) => item.id !== reminder.id),
		};
		setColumns(updatedColumns);
		localStorage.setItem('kanbanColumns', JSON.stringify(updatedColumns));

		// Agregar a completados
		const updatedCompleted = [...kanbanCompleted, reminder];
		setKanbanCompleted(updatedCompleted);

		console.log('✅ Kanban completado:', updatedCompleted);
		toast.success('✔️ Marcado como hecho');
	};

	const handleMarkAsCompleted = (reminder, fecha) => {
		// 1. Eliminar de listData (lista de recordatorios)
		const updatedList = listData
			.map((item) => ({
				...item,
				LIST: item.LIST.filter((sub) => sub.id !== reminder.id),
			}))
			.filter((item) => item.LIST.length > 0); // Limpia fechas vacías

		setListData(updatedList);
		localStorage.setItem('listData', JSON.stringify(updatedList));

		// 2. Eliminar del Kanban
		const newColumns = { ...columns };
		Object.keys(newColumns).forEach((colId) => {
			newColumns[colId] = newColumns[colId].filter(
				(item) => item.id !== reminder.id
			);
		});
		setColumns(newColumns);
		localStorage.setItem('kanbanColumns', JSON.stringify(newColumns));

		// 3. Agregar a completedList
		const updatedCompleted = [...completedList, reminder];
		setCompletedList(updatedCompleted);
		localStorage.setItem('kanbanCompleted', JSON.stringify(updatedCompleted));

		// Log para verificar
		console.log('✅ Completado y movido:', reminder);
	};

	const handleCancelModal = () => {
		if (tempRemovedItem && sourceColumnId) {
			const updatedColumns = { ...columns };
			// Restaurar el item a su columna original
			if (!updatedColumns[sourceColumnId]) {
				updatedColumns[sourceColumnId] = [];
			}
			updatedColumns[sourceColumnId].push(tempRemovedItem);
			setColumns(updatedColumns);
			localStorage.setItem('kanbanColumns', JSON.stringify(updatedColumns));
		}
		setTempRemovedItem(null);
		setSourceColumnId(null);
	};

	const handleSaveFromModal = (reminder) => {
		const formattedDate = reminder.date.replace(/-/g, '/');

		const newItem = {
			id: reminder.id || Date.now(),
			title: reminder.title,
			description: `${formattedDate} - ${reminder.time}`,
			type: reminder.type || 'personal',
		};

		const updatedColumns = { ...columns };

		// Quitar el reminder de todas las columnas (para evitar duplicados)
		Object.keys(updatedColumns).forEach((columnId) => {
			updatedColumns[columnId] = updatedColumns[columnId].filter(
				(item) => item.id !== newItem.id
			);
		});

		const currentColumn = reminder.columnId;
		const targetColumn = currentColumn || 'POR VENCER'; // Usa columna actual si existe

		if (!updatedColumns[targetColumn]) {
			updatedColumns[targetColumn] = [];
		}

		updatedColumns[targetColumn].unshift(newItem);
		updatedColumns[targetColumn] = sortCardsByDate(
			updatedColumns[targetColumn]
		);

		setColumns(updatedColumns);
		localStorage.setItem('kanbanColumns', JSON.stringify(updatedColumns));
		toast.success(`✅ Recordatorio guardado en ${targetColumn}`);
	};

	const saveReminderInOriginalColumn = (reminder, originalColumnId) => {
		setColumns((prevColumns) => {
			const updatedColumns = { ...prevColumns };

			// Quitar el recordatorio de todas las columnas
			for (const columnId in updatedColumns) {
				updatedColumns[columnId] = updatedColumns[columnId].filter(
					(item) => item.id !== reminder.id
				);
			}

			// Agregar el recordatorio editado a su columna original
			updatedColumns[originalColumnId] = [
				...updatedColumns[originalColumnId],
				reminder,
			];

			return updatedColumns;
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
		deleteReminder,
		completeReminder,
		handleMarkAsCompleted,
		handleSaveFromModal,
		handleCancelModal,
		saveReminderInOriginalColumn,
	};
};
