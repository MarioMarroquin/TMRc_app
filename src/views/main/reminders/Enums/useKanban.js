import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { format, addDays } from 'date-fns';
import { reminderData } from '@views/main/reminders/ReminderData.js';

export const useKanban = () => {
	const formatDate = (dateString, hora) => {
		if (!dateString) return '';
		const [year, month, day] = dateString.split('/');
		const formattedDate = `${day.padStart(2, '0')}/${month.padStart(
			2,
			'0'
		)}/${year}`;
		return hora ? `${formattedDate} - ${hora}` : formattedDate;
	};

	const transformReminderDataToKanban = () => {
		const initialColumns = {
			VENCIDO: [],
			HOY: [],
			'POR VENCER': [],
		};

		reminderData.pasado?.forEach((group) => {
			group.LIST.forEach((item) => {
				initialColumns.VENCIDO.push({
					id: item.id,
					title: item.SERVICIO,
					description: formatDate(group.FECHA, item.HORA),
					type: item.type || 'lead',
					empresa: item.EMPRESA,
					cliente: item.CLIENTE,
					contact: item.CONTACT,
					folio: item.FOLIO,
				});
			});
		});

		reminderData.hoy?.forEach((group) => {
			group.LIST.forEach((item) => {
				initialColumns.HOY.push({
					id: item.id,
					title: item.SERVICIO,
					description: formatDate(group.FECHA, item.HORA),
					type: item.type || 'lead',
					empresa: item.EMPRESA,
					cliente: item.CLIENTE,
					contact: item.CONTACT,
					folio: item.FOLIO,
				});
			});
		});

		reminderData.porVencer?.forEach((group) => {
			group.LIST.forEach((item) => {
				initialColumns['POR VENCER'].push({
					id: item.id,
					title: item.SERVICIO,
					description: formatDate(group.FECHA, item.HORA),
					type: item.type || 'lead',
					empresa: item.EMPRESA,
					cliente: item.CLIENTE,
					contact: item.CONTACT,
					folio: item.FOLIO,
				});
			});
		});

		return initialColumns;
	};

	const getInitialData = () => {
		try {
			const savedColumns = localStorage.getItem('kanbanColumns');
			if (savedColumns) {
				const parsedColumns = JSON.parse(savedColumns);
				const hasData = Object.values(parsedColumns).some(
					(column) => column.length > 0
				);
				if (hasData) {
					return parsedColumns;
				}
			}
			return transformReminderDataToKanban();
		} catch (error) {
			console.error('Error loading kanban data:', error);
			return transformReminderDataToKanban();
		}
	};

	const [columns, setColumns] = useState(getInitialData);
	const [modalOpen, setModalOpen] = useState(false);
	const [quickModalOpen, setQuickModalOpen] = useState(false);
	const [selectedReminder, setSelectedReminder] = useState(null);
	const [activeColumn, setActiveColumn] = useState(null);
	const [quickModalColumn, setQuickModalColumn] = useState(null);
	const [itemToEdit, setItemToEdit] = useState(null);
	const [tempRemovedItem, setTempRemovedItem] = useState(null);
	const [sourceColumnId, setSourceColumnId] = useState(null);
	const [selectedDate, setSelectedDate] = useState('');
	const [selectedTime, setSelectedTime] = useState('');
	const [title, setTitle] = useState('');

	useEffect(() => {
		if (columns && Object.keys(columns).length > 0) {
			localStorage.setItem('kanbanColumns', JSON.stringify(columns));
		}
	}, [columns]);

	useEffect(() => {
		const handleStorageChange = (e) => {
			if (e.key === 'kanbanColumns') {
				const newData = JSON.parse(e.newValue);
				setColumns(newData);
			}
		};

		window.addEventListener('storage', handleStorageChange);
		return () => window.removeEventListener('storage', handleStorageChange);
	}, []);

	const sortColumnByDate = (cards) => {
		return [...cards].sort((a, b) => {
			try {
				// Extraer fechas de la descripción (formato dd/mm/yyyy - HH:mm)
				const [dateStrA] = a.description.split(' - ');
				const [dateStrB] = b.description.split(' - ');

				// Convertir dd/mm/yyyy a yyyy/mm/dd para comparación correcta
				const [dayA, monthA, yearA] = dateStrA.split('/');
				const [dayB, monthB, yearB] = dateStrB.split('/');

				// Crear objetos Date
				const dateA = new Date(yearA, monthA - 1, dayA);
				const dateB = new Date(yearB, monthB - 1, dayB);

				// Ordenar de más reciente a más antiguo (orden descendente)
				return dateB - dateA;
			} catch (error) {
				console.error('Error en ordenamiento:', error);
				return 0;
			}
		});
	};

	// Generación de fechas y horas disponibles
	const generateAvailableDates = () => {
		const dates = [];
		const today = new Date();
		for (let i = 0; i < 7; i++) {
			const date = addDays(today, i);
			dates.push(format(date, 'dd/MM/yyyy'));
		}
		return dates;
	};

	const generateAvailableTimes = () => {
		const times = [];
		for (let hour = 8; hour <= 18; hour++) {
			times.push(`${hour.toString().padStart(2, '0')}:00`);
			times.push(`${hour.toString().padStart(2, '0')}:30`);
		}
		return times;
	};

	const availableDates = generateAvailableDates();
	const availableTimes = generateAvailableTimes();

	// Funciones para modales
	const handleCreateReminderSave = () => {
		const newReminder = {
			id: Date.now(),
			title,
			description: `${selectedDate} - ${selectedTime}`,
			type: 'personal',
		};

		setColumns((prev) => {
			const updatedColumn = [...prev[activeColumn], newReminder];
			return {
				...prev,
				[activeColumn]: sortColumnByDate(updatedColumn),
			};
		});

		handleCloseModal();
		toast.success('✔️ Recordatorio creado');
	};

	const handleCardEditSave = (editedReminder) => {
		if (!itemToEdit) return;

		const updatedReminder = {
			...itemToEdit,
			title: editedReminder.title,
			description: `${editedReminder.date} - ${editedReminder.time}`,
			type: itemToEdit.type || 'lead',
		};

		setColumns((prev) => {
			const newColumns = { ...prev };

			// Si hay un sourceColumnId, significa que viene de un arrastre a POR VENCER
			if (sourceColumnId && tempRemovedItem) {
				// Añadir a POR VENCER con los cambios
				newColumns['POR VENCER'] = [
					...newColumns['POR VENCER'],
					updatedReminder,
				];
				// Ordenar la columna POR VENCER
				newColumns['POR VENCER'] = sortColumnByDate(newColumns['POR VENCER']);
			} else {
				// Caso de edición normal (doble clic) - mantener en la misma columna
				Object.keys(newColumns).forEach((columnId) => {
					if (newColumns[columnId].some((item) => item.id === itemToEdit.id)) {
						newColumns[columnId] = newColumns[columnId].map((item) =>
							item.id === itemToEdit.id ? updatedReminder : item
						);
						// Ordenar la columna actual
						newColumns[columnId] = sortColumnByDate(newColumns[columnId]);
					}
				});
			}

			return newColumns;
		});

		// Limpiar estados temporales
		setTempRemovedItem(null);
		setSourceColumnId(null);
		handleCloseModal();
		toast.success('✔️ Recordatorio actualizado');
	};

	const handleQuickReminderSave = (columnId, reminder) => {
		try {
			const newReminder = {
				...reminder,
				id: Date.now(),
				type: 'personal', // Asegurarse de que sea 'personal'
			};

			setColumns((prev) => {
				// Primero agregamos el nuevo recordatorio
				const updatedColumn = [...prev[columnId], newReminder];
				// Luego ordenamos la columna
				const sortedColumn = sortColumnByDate(updatedColumn);

				// Actualizamos el estado con la columna ordenada
				return {
					...prev,
					[columnId]: sortedColumn,
				};
			});

			// Actualizar localStorage
			localStorage.setItem(
				'kanbanColumns',
				JSON.stringify({
					...columns,
					[columnId]: sortColumnByDate([...columns[columnId], newReminder]),
				})
			);

			toast.success('✔️ Recordatorio creado');
		} catch (error) {
			console.error('Error al crear el recordatorio:', error);
			toast.error('Error al crear el recordatorio');
		}
	};

	// Funciones de limpieza y manejo de modales
	const resetForm = () => {
		setSelectedDate('');
		setSelectedTime('');
		setTitle('');
	};

	const handleCloseModal = (isCancelled = false) => {
		if (isCancelled && tempRemovedItem && sourceColumnId) {
			// Si se cancela y hay un item temporal, restaurarlo a su columna original
			setColumns((prev) => {
				const newColumns = { ...prev };
				// Devolver el item a su columna original
				newColumns[sourceColumnId] = [
					...newColumns[sourceColumnId],
					tempRemovedItem,
				];
				// Mantener el orden en la columna original
				newColumns[sourceColumnId] = sortColumnByDate(
					newColumns[sourceColumnId]
				);
				return newColumns;
			});
		}

		setModalOpen(false);
		setSelectedReminder(null);
		setItemToEdit(null);
		setTempRemovedItem(null);
		setSourceColumnId(null);
	};

	const handleCloseQuickModal = () => {
		setQuickModalOpen(false);
		setQuickModalColumn(null);
		resetForm();
	};

	const handleOpenModal = (columnId, reminder = null) => {
		setActiveColumn(columnId);
		if (reminder) {
			// Si es una edición (doble clic), solo abrimos el modal de edición
			setItemToEdit(reminder);
			const [date, time] = reminder.description.split(' - ');
			setSelectedDate(date);
			setSelectedTime(time);
			setTitle(reminder.title);
			setModalOpen(false); // Aseguramos que el modal de creación esté cerrado
		} else {
			// Si es creación nueva
			setModalOpen(true);
			setItemToEdit(null); // Aseguramos que no haya item en edición
		}
	};

	const handleOpenQuickModal = (columnId) => {
		setQuickModalColumn(columnId);
		setQuickModalOpen(true);
	};

	// Funciones de arrastre
	const handleDragStart = (e, reminder, columnId) => {
		e.dataTransfer.setData('reminderId', reminder.id.toString());
		e.dataTransfer.setData('sourceColumnId', columnId);
		e.target.style.opacity = '0.5';
	};

	const handleDragEnd = (e) => {
		e.target.style.opacity = '';
	};

	const handleDrop = (e, targetColumnId) => {
		e.preventDefault();
		const reminderId = e.dataTransfer.getData('reminderId');
		const sourceColumnId = e.dataTransfer.getData('sourceColumnId');

		if (sourceColumnId !== targetColumnId) {
			const reminderIdNum = parseInt(reminderId, 10);
			const sourceList = columns[sourceColumnId];
			if (!sourceList) return;

			const reminder = sourceList.find((item) => item.id === reminderIdNum);
			if (!reminder) return;

			// Si la columna destino es POR VENCER, mantenemos la lógica del modal
			if (targetColumnId === 'POR VENCER') {
				setTempRemovedItem(reminder);
				setSourceColumnId(sourceColumnId);

				setColumns((prev) => ({
					...prev,
					[sourceColumnId]: prev[sourceColumnId].filter(
						(item) => item.id !== reminderIdNum
					),
				}));

				setItemToEdit(reminder);
				const [date, time] = reminder.description.split(' - ');
				handleOpenModal(targetColumnId, {
					...reminder,
					date,
					time,
				});
			}
			// Nueva lógica para el grid HOY
			else if (targetColumnId === 'HOY') {
				// Obtener la fecha actual en formato dd/mm/yyyy
				const today = new Date();
				const formattedToday = today
					.toLocaleDateString('es-ES', {
						day: '2-digit',
						month: '2-digit',
						year: 'numeric',
					})
					.replace(/\//g, '/');

				// Mantener la hora original del recordatorio
				const [_, originalTime] = reminder.description.split(' - ');

				// Crear el recordatorio actualizado con la fecha de hoy
				const updatedReminder = {
					...reminder,
					description: `${formattedToday} - ${originalTime || '00:00'}`,
				};

				setColumns((prev) => {
					const newColumns = { ...prev };
					// Remover de la columna origen
					newColumns[sourceColumnId] = newColumns[sourceColumnId].filter(
						(item) => item.id !== reminderIdNum
					);
					// Añadir a HOY con la fecha actualizada
					newColumns[targetColumnId] = [
						...newColumns[targetColumnId],
						updatedReminder,
					];
					// Ordenar la columna HOY
					newColumns[targetColumnId] = sortColumnByDate(
						newColumns[targetColumnId]
					);
					return newColumns;
				});

				// Notificar el cambio de fecha
				toast.success('📅 Fecha actualizada a hoy');
			}
			// Mantener el comportamiento normal para otras columnas
			else {
				setColumns((prev) => {
					const newColumns = { ...prev };
					newColumns[sourceColumnId] = newColumns[sourceColumnId].filter(
						(item) => item.id !== reminderIdNum
					);
					newColumns[targetColumnId] = [
						...newColumns[targetColumnId],
						reminder,
					];
					newColumns[targetColumnId] = sortColumnByDate(
						newColumns[targetColumnId]
					);
					return newColumns;
				});
			}
		}
	};

	const getCurrentDate = () => {
		const today = new Date();
		const dd = String(today.getDate()).padStart(2, '0');
		const mm = String(today.getMonth() + 1).padStart(2, '0');
		const yyyy = today.getFullYear();
		return `${dd}/${mm}/${yyyy}`;
	};

	const deleteReminder = (id, columnId) => {
		try {
			// Actualizar columnas
			setColumns((prevColumns) => {
				const newColumns = { ...prevColumns };
				Object.keys(newColumns).forEach((colId) => {
					newColumns[colId] = newColumns[colId].filter(
						(item) => item.id !== id
					);
				});
				localStorage.setItem('kanbanColumns', JSON.stringify(newColumns));
				return newColumns;
			});

			// Actualizar listData
			setListData((prevData) => {
				const newData = prevData
					.map((group) => ({
						...group,
						LIST: group.LIST.filter((item) => item.id !== id),
					}))
					.filter((group) => group.LIST.length > 0);
				localStorage.setItem('listData', JSON.stringify(newData));
				return newData;
			});

			// Actualizar deletedItems
			setDeletedItems((prev) => {
				const newDeletedItems = [...prev, id];
				localStorage.setItem('deletedItems', JSON.stringify(newDeletedItems));
				return newDeletedItems;
			});

			// Disparar eventos
			window.dispatchEvent(new Event('listDataUpdate'));
			window.dispatchEvent(new Event('kanbanUpdate'));

			toast.error('🗑️ Recordatorio eliminado');
		} catch (error) {
			console.error('Error al eliminar el recordatorio:', error);
			toast.error('Error al eliminar el recordatorio');
		}
	};

	const moveReminder = (reminderId, targetColumnId) => {
		setColumns((prev) => {
			const newColumns = { ...prev };
			let movedItem;

			Object.keys(newColumns).forEach((columnId) => {
				const itemIndex = newColumns[columnId].findIndex(
					(item) => item.id.toString() === reminderId
				);
				if (itemIndex !== -1) {
					[movedItem] = newColumns[columnId].splice(itemIndex, 1);
				}
			});

			if (movedItem) {
				newColumns[targetColumnId].push(movedItem);
				newColumns[targetColumnId].sort((a, b) => {
					const dateA = new Date(a.description.split(' - ')[0]);
					const dateB = new Date(b.description.split(' - ')[0]);
					return dateA - dateB;
				});
			}

			return newColumns;
		});
	};

	const resetKanbanData = () => {
		const transformedData = transformReminderDataToKanban(reminderData);
		setColumns(transformedData);
		localStorage.setItem('kanbanColumns', JSON.stringify(transformedData));
		toast.success('✔️ Datos reiniciados');
	};

	return {
		columns,
		setColumns,
		modalOpen,
		quickModalOpen,
		selectedReminder,
		activeColumn,
		quickModalColumn,
		itemToEdit,
		selectedDate,
		selectedTime,
		title,
		availableDates,
		availableTimes,
		resetKanbanData,
		setSelectedDate,
		setSelectedTime,
		setTitle,
		handleDragStart,
		handleDragEnd,
		handleDrop,
		handleOpenModal,
		handleCloseModal,
		handleOpenQuickModal,
		handleCloseQuickModal,
		deleteReminder,
		moveReminder,
		handleCreateReminderSave,
		handleCardEditSave,
		handleQuickReminderSave,
		tempRemovedItem,
		sourceColumnId,
		setTempRemovedItem,
		setSourceColumnId,
	};
};
