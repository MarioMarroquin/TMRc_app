import { useQuery } from '@apollo/client';
import { GET_LEAD_REMINDERS } from './queryLeadReminders';
import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { reminderData } from '@views/main/reminders/ReminderData.js';

const convertToDate = (dateString) => {
	if (!dateString || typeof dateString !== 'string') return new Date();

	const [day, month, year] = dateString.split('/');
	return new Date(`${year}-${month}-${day}`);
};

const sortRemindersByDate = (reminders) => {
	return [...reminders].sort((a, b) => {
		// Extraer las fechas de la descripción (formato dd/MM/yyyy)
		const [dateA] = a.description?.split(' - ') || [''];
		const [dateB] = b.description?.split(' - ') || [''];

		// Convertir las fechas a objetos Date
		const [dayA, monthA, yearA] = dateA.split('/').map(Number);
		const [dayB, monthB, yearB] = dateB.split('/').map(Number);

		const dateObjA = new Date(yearA, monthA - 1, dayA);
		const dateObjB = new Date(yearB, monthB - 1, dayB);

		// Ordenar de más reciente a más antiguo
		return dateObjB - dateObjA;
	});
};

const extractDateFromDescription = (description) => {
	if (!description) return new Date(0); // fecha muy antigua por defecto
	const [dateStr] = description.split(' - ');
	const [dd, mm, yyyy] = dateStr.split('/');
	return new Date(`${yyyy}-${mm}-${dd}`);
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

	const [showList, setShowList] = useState(() => {
		const saved = localStorage.getItem('showList');
		return saved ? JSON.parse(saved) : false;
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
		return localStorage.getItem('selectedView') || 'hoy';
	});

	useEffect(() => {
		localStorage.setItem('selectedView', selectedView);
	}, [selectedView]);

	useEffect(() => {
		localStorage.setItem('showList', JSON.stringify(showList));
	}, [showList]);

	const currentData = reminderDataState[selectedView] || [];
	const [listData, setListData] = useState(() => {
		const saved = localStorage.getItem('listData');
		return saved ? JSON.parse(saved) : [];
	});

	const [columns, setColumns] = useState(() => {
		const saved = localStorage.getItem('kanbanColumns');
		return saved
			? JSON.parse(saved)
			: {
					VENCIDO: [],
					HOY: [],
					'POR VENCER': [],
			  };
	});

	const [openEditDialog, setOpenEditDialog] = useState(false);
	const [itemToEdit, setItemToEdit] = useState(null);

	const [deletedItems, setDeletedItems] = useState(() => {
		const stored = localStorage.getItem('deletedItems');
		return stored ? JSON.parse(stored) : [];
	});

	useEffect(() => {
		if (Object.keys(columns).length > 0) {
			try {
				localStorage.setItem('kanbanColumns', JSON.stringify(columns));
				console.log('Estado persistido:', columns);
			} catch (error) {
				console.error('Error al persistir estado:', error);
			}
		}
	}, [columns]);

	useEffect(() => {
		const loadInitialState = () => {
			try {
				const savedColumns = localStorage.getItem('kanbanColumns');
				if (savedColumns) {
					const parsedColumns = JSON.parse(savedColumns);
					setColumns(parsedColumns);
					console.log('Columnas cargadas:', parsedColumns);
				}
			} catch (error) {
				console.error('Error cargando estado inicial:', error);
			}
		};

		loadInitialState();
	}, []);

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

	const saveStateToLocalStorage = (data) => {
		try {
			Object.entries(data).forEach(([key, value]) => {
				localStorage.setItem(key, JSON.stringify(value));
			});
			console.log('Todo el estado guardado correctamente');
		} catch (error) {
			console.error('Error guardando en localStorage:', error);
		}
	};

	const loadStateFromLocalStorage = () => {
		try {
			const columns = JSON.parse(localStorage.getItem('kanbanColumns')) || {
				VENCIDO: [],
				HOY: [],
				'POR VENCER': [],
			};
			const completedList =
				JSON.parse(localStorage.getItem('completedList')) || [];
			const listData = JSON.parse(localStorage.getItem('listData')) || [];
			const deletedItems =
				JSON.parse(localStorage.getItem('deletedItems')) || [];

			return {
				columns,
				completedList,
				listData,
				deletedItems,
			};
		} catch (error) {
			console.error('Error al cargar datos:', error);
			return {
				columns: { VENCIDO: [], HOY: [], 'POR VENCER': [] },
				completedList: [],
				listData: [],
				deletedItems: [],
			};
		}
	};

	useEffect(() => {
		const savedState = loadStateFromLocalStorage();
		setColumns(savedState.columns);
		setCompletedList(savedState.completedList);
		setListData(savedState.listData);
		setDeletedItems(savedState.deletedItems);
	}, []);

	useEffect(() => {
		saveStateToLocalStorage({
			columns,
			completedList,
			listData,
			deletedItems,
		});
	}, [columns, completedList, listData, deletedItems]);

	const findReminderStatusById = (id) => {
		for (const [status, list] of Object.entries(columns)) {
			if (list.find((item) => item.id === id)) {
				return status;
			}
		}
		return null;
	};

	const handleEditClick = (item, fecha, columnId) => {
		setItemToEdit({
			...item,
			FECHA: fecha,
			columnId: columnId, // Asegúrate de pasar la columna
		});
		setOpenEditDialog(true);
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

	const addReminderToColumn = (columnId, reminder) => {
		setColumns((prev) => {
			const updated = {
				...prev,
				[columnId]: sortCardsByDate([...prev[columnId], reminder]),
			};
			localStorage.setItem('kanbanColumns', JSON.stringify(updated));
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

	return {
		listData,
		setListData,
		completedList,
		setCompletedList,
		ListoClick,
		handleDeleteClick,
		handleConfirmDelete,
		handleCancelDelete,
		handleEditClick,
		openDialog,
		selectedItem,
		selectedView,
		setSelectedView,
		columns,
		setColumns,
		getToday,
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
		draggingColumnId,
		addReminderToColumn,
		deleteReminder,
		completeReminder,
		handleMarkAsCompleted,
		sortRemindersByDate,
	};
};
