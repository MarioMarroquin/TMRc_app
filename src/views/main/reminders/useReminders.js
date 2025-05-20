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
		try {
			// Primero, actualizar la lista de datos
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
				.filter((group) => group.LIST.length > 0);

			// Crear el objeto completado con el formato correcto para la tabla
			const completedItem = {
				id: item.id,
				FOLIO: item.FOLIO,
				SERVICIO: item.SERVICIO,
				EMPRESA: item.EMPRESA,
				CLIENTE: item.CLIENTE,
				CONTACT: item.CONTACT,
				HORA: item.HORA,
				FECHA: fechaOriginal,
				type: item.type || 'lead',
				completedDate: new Date().toISOString(),
			};

			// Actualizar el estado
			setListData(updatedListData);
			setCompletedList((prev) => [...prev, completedItem]);

			// Actualizar localStorage
			localStorage.setItem('listData', JSON.stringify(updatedListData));
			localStorage.setItem(
				'completedList',
				JSON.stringify([...completedList, completedItem])
			);

			toast.success('✔️ Recordatorio completado');
		} catch (error) {
			console.error('Error al completar el recordatorio:', error);
			toast.error('Error al completar el recordatorio');
		}
	};

	const handleDeleteClick = (item) => {
		setSelectedItem(item);
		setOpenDialog(true);
	};

	const handleConfirmDelete = () => {
		try {
			if (!selectedItem) return;

			// Eliminar de la lista
			setListData((prevData) => {
				const newData = prevData
					.map((group) => ({
						...group,
						LIST: group.LIST.filter((item) => item.id !== selectedItem.id),
					}))
					.filter((group) => group.LIST.length > 0);

				// Actualizar localStorage
				localStorage.setItem('listData', JSON.stringify(newData));
				return newData;
			});

			// Eliminar del Kanban
			const kanbanDataString = localStorage.getItem('kanbanColumns');
			if (kanbanDataString) {
				const kanbanData = JSON.parse(kanbanDataString);
				Object.keys(kanbanData).forEach((columnId) => {
					kanbanData[columnId] = kanbanData[columnId].filter(
						(item) => item.id !== selectedItem.id
					);
				});
				localStorage.setItem('kanbanColumns', JSON.stringify(kanbanData));
				// Disparar evento para actualizar el Kanban
				window.dispatchEvent(new Event('kanbanUpdate'));
			}

			toast.error('🗑️ Recordatorio eliminado');
			setOpenDialog(false);
		} catch (error) {
			console.error('Error al eliminar el recordatorio:', error);
			toast.error('Error al eliminar el recordatorio');
		}
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

	const handleMarkAsCompleted = (reminder) => {
		try {
			const isKanbanReminder = reminder.hasOwnProperty('title');

			// Crear el objeto completado con el formato correcto
			const completedReminder = {
				id: reminder.id,
				FOLIO: isKanbanReminder ? reminder.folio : reminder.FOLIO,
				SERVICIO: isKanbanReminder ? reminder.title : reminder.SERVICIO,
				EMPRESA: isKanbanReminder ? reminder.empresa : reminder.EMPRESA,
				CLIENTE: isKanbanReminder ? reminder.cliente : reminder.CLIENTE,
				CONTACT: isKanbanReminder ? reminder.contact : reminder.CONTACT,
				HORA: isKanbanReminder
					? reminder.description?.split(' - ')[1] || '00:00'
					: reminder.HORA || '00:00',
				type: reminder.type || 'lead',
				completedDate: new Date().toISOString(),
			};

			// Actualizar completedList
			setCompletedList((prev) => [...prev, completedReminder]);

			// Remover de listData si viene de la lista
			if (!isKanbanReminder) {
				setListData((prevListData) => {
					return prevListData
						.map((group) => ({
							...group,
							LIST: group.LIST.filter((item) => item.id !== reminder.id),
						}))
						.filter((group) => group.LIST.length > 0);
				});
			}

			// Remover del Kanban
			const storedColumns = localStorage.getItem('kanbanColumns');
			if (storedColumns) {
				const columns = JSON.parse(storedColumns);
				Object.keys(columns).forEach((columnId) => {
					columns[columnId] = columns[columnId].filter(
						(item) => item.id !== reminder.id
					);
				});
				localStorage.setItem('kanbanColumns', JSON.stringify(columns));
				window.dispatchEvent(new Event('kanbanUpdate'));
			}

			// Actualizar localStorage
			localStorage.setItem(
				'completedList',
				JSON.stringify([...completedList, completedReminder])
			);

			toast.success('✔️ Recordatorio completado');
		} catch (error) {
			console.error('Error al completar el recordatorio:', error);
			toast.error('Error al completar el recordatorio');
		}
	};

	const handleUndoCompleted = (reminder) => {
		try {
			// Formatear la fecha actual
			const today = new Date();
			const year = today.getFullYear();
			const month = String(today.getMonth() + 1).padStart(2, '0');
			const day = String(today.getDate()).padStart(2, '0');
			const formattedDate = `${year}/${month}/${day}`;

			// Crear objeto para la lista
			const newListItem = {
				id: reminder.id,
				FOLIO: reminder.FOLIO,
				SERVICIO: reminder.SERVICIO,
				EMPRESA: reminder.EMPRESA,
				CLIENTE: reminder.CLIENTE,
				CONTACT: reminder.CONTACT,
				HORA: reminder.HORA || '12:00',
				type: reminder.type || 'lead',
			};

			// Actualizar listData
			setListData((prevData) => {
				const existingGroup = prevData.find(
					(group) => group.FECHA === formattedDate
				);
				if (existingGroup) {
					return prevData.map((group) => {
						if (group.FECHA === formattedDate) {
							return {
								...group,
								LIST: [...group.LIST, newListItem],
							};
						}
						return group;
					});
				} else {
					return [
						...prevData,
						{
							FECHA: formattedDate,
							LIST: [newListItem],
						},
					];
				}
			});

			// Crear objeto para Kanban
			const kanbanItem = {
				id: reminder.id,
				title: reminder.SERVICIO,
				description: `${day}/${month}/${year} - ${reminder.HORA || '12:00'}`,
				type: reminder.type || 'lead',
				empresa: reminder.EMPRESA,
				cliente: reminder.CLIENTE,
				contact: reminder.CONTACT,
				folio: reminder.FOLIO,
			};

			// Actualizar Kanban
			const storedColumns = localStorage.getItem('kanbanColumns');
			if (storedColumns) {
				const columns = JSON.parse(storedColumns);
				columns.HOY = [...(columns.HOY || []), kanbanItem];
				localStorage.setItem('kanbanColumns', JSON.stringify(columns));
				window.dispatchEvent(new Event('kanbanUpdate'));
			}

			// Remover de la lista de completados
			setCompletedList((prev) =>
				prev.filter((item) => item.id !== reminder.id)
			);
			localStorage.setItem(
				'completedList',
				JSON.stringify(completedList.filter((item) => item.id !== reminder.id))
			);

			toast.success('✔️ Recordatorio restaurado');
		} catch (error) {
			console.error('Error al restaurar el recordatorio:', error);
			toast.error('Error al restaurar el recordatorio');
		}
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
		handleUndoCompleted,
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
