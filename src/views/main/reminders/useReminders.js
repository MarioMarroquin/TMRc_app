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

		// Filtramos los datos excluyendo los elementos eliminados y completados
		const filteredData = currentData
			.map((group) => ({
				...group,
				LIST: group.LIST.filter(
					(item) =>
						!deletedLocal.includes(item.id) &&
						!completedLocal.some((completed) => completed.id === item.id)
				),
			}))
			.filter((group) => group.LIST.length > 0);

		setListData(sortRemindersByDate(filteredData)); // Mantenemos el ordenamiento
	}, [selectedView, reminderDataState, deletedItems, completedList]);

	const ListoClick = (item, fechaOriginal) => {
		try {
			// 1. Actualizar listData
			const updatedListData = listData
				.map((group) => ({
					...group,
					LIST: group.LIST.filter((i) => i.id !== item.id),
				}))
				.filter((group) => group.LIST.length > 0);

			// 2. Crear el item completado con todos los campos necesarios
			const completedItem = {
				id: item.id,
				FOLIO: item.FOLIO,
				SERVICIO: item.SERVICIO,
				EMPRESA: item.EMPRESA,
				CLIENTE: item.CLIENTE,
				CONTACT: item.CONTACT,
				HORA: item.HORA,
				FECHA: fechaOriginal || item.FECHA,
				type: item.type || 'lead',
				completedDate: new Date().toISOString(),
			};

			// 3. Actualizar estados y localStorage
			setListData(updatedListData);
			setCompletedList((prev) => [...prev, completedItem]);

			// 4. Actualizar localStorage
			localStorage.setItem('listData', JSON.stringify(updatedListData));
			localStorage.setItem(
				'completedList',
				JSON.stringify([...completedList, completedItem])
			);

			// 5. También actualizar el Kanban
			setColumns((prevColumns) => {
				const newColumns = { ...prevColumns };
				Object.keys(newColumns).forEach((columnId) => {
					newColumns[columnId] = newColumns[columnId].filter(
						(kanbanItem) => kanbanItem.id !== item.id
					);
				});
				return newColumns;
			});

			toast.success('✔️ Recordatorio completado');
		} catch (error) {
			console.error('Error en ListoClick:', error);
			toast.error('Error al completar el recordatorio');
		}
	};

	const handleDeleteClick = (item) => {
		try {
			if (!window.confirm('¿Estás seguro de eliminar este recordatorio?')) {
				return;
			}

			// 1. Actualizar listData
			setListData((prevData) => {
				const newData = prevData
					.map((group) => ({
						...group,
						LIST: group.LIST.filter((i) => i.id !== item.id),
					}))
					.filter((group) => group.LIST.length > 0);
				localStorage.setItem('listData', JSON.stringify(newData));
				return newData;
			});

			// 2. Actualizar Kanban - Este es el cambio principal
			setColumns((prevColumns) => {
				const newColumns = { ...prevColumns };
				// Eliminar el item de todas las columnas del Kanban
				Object.keys(newColumns).forEach((columnId) => {
					newColumns[columnId] = newColumns[columnId].filter(
						(kanbanItem) => kanbanItem.id !== item.id
					);
				});
				localStorage.setItem('kanbanColumns', JSON.stringify(newColumns));
				return newColumns;
			});

			// 3. Actualizar deletedItems
			setDeletedItems((prev) => {
				const newDeletedItems = [...prev, item.id];
				localStorage.setItem('deletedItems', JSON.stringify(newDeletedItems));
				return newDeletedItems;
			});

			// 4. Disparar eventos de actualización
			window.dispatchEvent(
				new CustomEvent('listDataUpdate', { detail: listData })
			);
			window.dispatchEvent(
				new CustomEvent('kanbanUpdate', { detail: columns })
			);

			toast.error('🗑️ Recordatorio eliminado');
		} catch (error) {
			console.error('Error al eliminar el recordatorio:', error);
			toast.error('Error al eliminar el recordatorio');
		}
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
				localStorage.setItem('listData', JSON.stringify(newData));
				return newData;
			});

			// Eliminar del Kanban
			setColumns((prevColumns) => {
				const newColumns = { ...prevColumns };
				Object.keys(newColumns).forEach((columnId) => {
					newColumns[columnId] = newColumns[columnId].filter(
						(item) => item.id !== selectedItem.id
					);
				});
				localStorage.setItem('kanbanColumns', JSON.stringify(newColumns));
				return newColumns;
			});

			// Actualizar deletedItems
			setDeletedItems((prev) => [...prev, selectedItem.id]);
			localStorage.setItem(
				'deletedItems',
				JSON.stringify([...deletedItems, selectedItem.id])
			);

			toast.error('🗑️ Recordatorio eliminado');
			setOpenDialog(false);
			setSelectedItem(null);
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

	const handleEditClick = (item) => {
		setSelectedItem({ ...item }); // Guardar una copia del item original
		setItemToEdit({ ...item }); // Crear una copia para editar
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

	const handleSaveEdit = () => {
		// Validar campos requeridos
		if (!itemToEdit.FOLIO?.trim()) {
			toast.error('El folio es requerido');
			return;
		}

		if (!itemToEdit.SERVICIO?.trim()) {
			toast.error('El servicio es requerido');
			return;
		}

		// Validar formato del folio (por ejemplo, solo números y letras)
		const folioRegex = /^[A-Za-z0-9-]+$/;
		if (!folioRegex.test(itemToEdit.FOLIO)) {
			toast.error('El folio solo puede contener letras, números y guiones');
			return;
		}

		// Validar longitud máxima del servicio
		if (itemToEdit.SERVICIO.length > 100) {
			toast.error('El servicio no puede exceder los 100 caracteres');
			return;
		}

		// Validar formato de email si existe
		if (
			itemToEdit.email &&
			!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(itemToEdit.email)
		) {
			toast.error('El formato del correo electrónico no es válido');
			return;
		}

		// Validar formato de teléfono si existe (asumiendo formato mexicano)
		if (itemToEdit.phoneNumber) {
			const phoneRegex = /^\+?52?\d{10}$/;
			if (!phoneRegex.test(itemToEdit.phoneNumber.replace(/\D/g, ''))) {
				toast.error('El formato del teléfono no es válido (10 dígitos)');
				return;
			}
		}

		// Si todas las validaciones pasan, proceder con el guardado
		const updatedListData = listData.map((group) => ({
			...group,
			LIST: group.LIST.map((item) =>
				item.id === itemToEdit.id ? itemToEdit : item
			),
		}));

		setListData(updatedListData);
		handleCancelEdit();
		toast.success('Registro actualizado correctamente');
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

	const handleUndoCompleted = useCallback(
		(item) => {
			try {
				// 1. Validar que tengamos todos los datos necesarios
				if (!item || !item.FECHA) {
					throw new Error('Datos del recordatorio incompletos');
				}

				// 2. Remover de completedList
				const newCompletedList = completedList.filter(
					(completedItem) => completedItem.id !== item.id
				);
				setCompletedList(newCompletedList);

				// 3. Determinar la columna apropiada basada en la fecha
				const today = new Date();
				today.setHours(0, 0, 0, 0);

				// Asegurarnos de que la fecha esté en el formato correcto (dd/mm/yyyy)
				let day, month, year;
				try {
					// Intentar obtener las partes de la fecha
					if (item.FECHA.includes('-')) {
						[year, month, day] = item.FECHA.split('-');
					} else {
						[day, month, year] = item.FECHA.split('/');
					}

					// Asegurarse de que los valores sean números
					day = parseInt(day, 10);
					month = parseInt(month, 10);
					year = parseInt(year, 10);

					// Validar que los valores sean razonables
					if (isNaN(day) || isNaN(month) || isNaN(year)) {
						throw new Error('Formato de fecha inválido');
					}
				} catch (error) {
					console.error('Error parsing date:', error);
					// Si hay un error con la fecha, colocarlo en POR VENCER por defecto
					day = today.getDate();
					month = today.getMonth() + 1;
					year = today.getFullYear();
				}

				const itemDate = new Date(year, month - 1, day);
				itemDate.setHours(0, 0, 0, 0);

				let targetColumn = 'POR VENCER';
				if (itemDate < today) {
					targetColumn = 'VENCIDO';
				} else if (itemDate.getTime() === today.getTime()) {
					targetColumn = 'HOY';
				}

				// 4. Preparar el item para Kanban
				const kanbanItem = {
					id: item.id,
					title: item.SERVICIO || 'Sin título',
					description: `${day.toString().padStart(2, '0')}/${month
						.toString()
						.padStart(2, '0')}/${year}${item.HORA ? ` - ${item.HORA}` : ''}`,
					type: item.type || 'lead',
					empresa: item.EMPRESA || '',
					cliente: item.CLIENTE || '',
					contact: item.CONTACT || '',
					folio: item.FOLIO || '',
					FECHA: `${day.toString().padStart(2, '0')}/${month
						.toString()
						.padStart(2, '0')}/${year}`,
				};

				// 5. Actualizar Kanban
				setColumns((prevColumns) => {
					const newColumns = { ...prevColumns };
					if (!newColumns[targetColumn]) {
						newColumns[targetColumn] = [];
					}
					newColumns[targetColumn] = [...newColumns[targetColumn], kanbanItem];
					localStorage.setItem('kanbanColumns', JSON.stringify(newColumns));
					return newColumns;
				});

				// 6. Actualizar listData
				const listItem = {
					id: item.id,
					FOLIO: item.FOLIO || '',
					SERVICIO: item.SERVICIO || 'Sin título',
					EMPRESA: item.EMPRESA || '',
					CLIENTE: item.CLIENTE || '',
					CONTACT: item.CONTACT || '',
					HORA: item.HORA || '',
					type: item.type || 'lead',
				};

				setListData((prevListData) => {
					const formattedDate = `${day.toString().padStart(2, '0')}/${month
						.toString()
						.padStart(2, '0')}/${year}`;
					const existingGroupIndex = prevListData.findIndex(
						(group) => group.FECHA === formattedDate
					);

					let newListData;
					if (existingGroupIndex >= 0) {
						newListData = [...prevListData];
						newListData[existingGroupIndex] = {
							...newListData[existingGroupIndex],
							LIST: [...newListData[existingGroupIndex].LIST, listItem],
						};
					} else {
						newListData = [
							...prevListData,
							{
								FECHA: formattedDate,
								LIST: [listItem],
							},
						];
					}

					localStorage.setItem('listData', JSON.stringify(newListData));
					return newListData;
				});

				// 7. Actualizar localStorage para completedList
				localStorage.setItem('completedList', JSON.stringify(newCompletedList));

				toast.success('✔️ Recordatorio restaurado');
			} catch (error) {
				console.error('Error al deshacer completado:', error);
				toast.error('Error al restaurar el recordatorio');
			}
		},
		[completedList, setCompletedList, setColumns, setListData]
	);

	useEffect(() => {
		const handleKanbanUpdate = () => {
			try {
				const kanbanData = JSON.parse(localStorage.getItem('kanbanColumns'));
				const listDataString = localStorage.getItem('listData');

				if (kanbanData && listDataString) {
					const currentListData = JSON.parse(listDataString);

					// Obtener todos los IDs del Kanban, incluyendo POR VENCER
					const kanbanIds = new Set([
						...kanbanData.VENCIDO.map((item) => item.id),
						...kanbanData.HOY.map((item) => item.id),
						...kanbanData['POR VENCER'].map((item) => item.id),
					]);

					const updatedListData = currentListData
						.map((group) => ({
							...group,
							LIST: group.LIST.filter((item) => kanbanIds.has(item.id)),
						}))
						.filter((group) => group.LIST.length > 0);

					setListData(updatedListData);
					localStorage.setItem('listData', JSON.stringify(updatedListData));
				}
			} catch (error) {
				console.error('Error en la sincronización Kanban-Lista:', error);
			}
		};

		window.addEventListener('kanbanUpdate', handleKanbanUpdate);
		return () => window.removeEventListener('kanbanUpdate', handleKanbanUpdate);
	}, []);

	const handleCancelEdit = () => {
		setItemToEdit(selectedItem); // Restaurar al valor original
		setOpenEditDialog(false);
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
		handleSaveEdit,
		handleCancelEdit,
	};
};
