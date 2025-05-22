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
				// Extraer fechas y horas
				const [dateStrA, timeA = '00:00'] = a.description.split(' - ');
				const [dateStrB, timeB = '00:00'] = b.description.split(' - ');

				// Convertir dd/mm/yyyy a objetos Date
				const [dayA, monthA, yearA] = dateStrA.split('/');
				const [dayB, monthB, yearB] = dateStrB.split('/');

				const dateA = new Date(`${yearA}-${monthA}-${dayA}T${timeA}`);
				const dateB = new Date(`${yearB}-${monthB}-${dayB}T${timeB}`);

				// Ordenar de más reciente a más antiguo (orden descendente)
				return dateB.getTime() - dateA.getTime();
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

		// Crear el recordatorio actualizado
		const updatedReminder = {
			...itemToEdit,
			title: editedReminder.title,
			description: `${editedReminder.date} - ${editedReminder.time}`,
			type: editedReminder.type,
		};

		setColumns((prev) => {
			const newColumns = { ...prev };

			// Para la columna POR VENCER, aplicamos ordenamiento especial
			if (activeColumn === 'POR VENCER') {
				// Remover la card antigua
				const otherCards = newColumns['POR VENCER'].filter(
					(item) => item.id !== itemToEdit.id
				);

				// Añadir la nueva card y ordenar todo el array
				const allCards = [...otherCards, updatedReminder];
				newColumns['POR VENCER'] = allCards.sort((a, b) => {
					try {
						// Extraer fechas y horas
						const [dateA] = a.description.split(' - ');
						const [dateB] = b.description.split(' - ');

						// Convertir dd/mm/yyyy a objetos Date para comparación
						const [dayA, monthA, yearA] = dateA.split('/');
						const [dayB, monthB, yearB] = dateB.split('/');

						const dateObjA = new Date(yearA, monthA - 1, dayA);
						const dateObjB = new Date(yearB, monthB - 1, dayB);

						// Ordenar de más reciente a más antiguo
						return dateObjB - dateObjA;
					} catch (error) {
						console.error('Error en ordenamiento:', error);
						return 0;
					}
				});
			} else {
				// Para otras columnas, mantener el comportamiento normal
				newColumns[activeColumn] = newColumns[activeColumn].map((item) =>
					item.id === itemToEdit.id ? updatedReminder : item
				);
			}

			return newColumns;
		});

		handleCloseModal();
		toast.success('✔️ Recordatorio actualizado');
	};

	const handleQuickReminderSave = () => {
		const today = new Date();
		const formattedDate = `${String(today.getDate()).padStart(2, '0')}/${String(
			today.getMonth() + 1
		).padStart(2, '0')}/${today.getFullYear()}`;

		const newReminder = {
			id: Date.now(),
			title,
			description: `${formattedDate} - ${selectedTime}`,
			type: 'personal',
		};

		setColumns((prev) => {
			const updatedColumn = [...prev[quickModalColumn], newReminder];
			return {
				...prev,
				[quickModalColumn]: sortColumnByDate(updatedColumn),
			};
		});

		handleCloseQuickModal();
		toast.success('✔️ Recordatorio rápido creado');
	};

	// Funciones de limpieza y manejo de modales
	const resetForm = () => {
		setSelectedDate('');
		setSelectedTime('');
		setTitle('');
	};

	const handleCloseModal = () => {
		setModalOpen(false);
		setSelectedReminder(null);
		setItemToEdit(null);
		// Solo limpiar estos estados si no se está guardando
		if (!modalOpen) {
			setTempRemovedItem(null);
			setSourceColumnId(null);
		}
		resetForm();
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

			if (reminder) {
				if (targetColumnId === 'POR VENCER') {
					setItemToEdit(reminder);
					setActiveColumn(targetColumnId);
					setSelectedReminder(reminder);
					setModalOpen(true);
					setSourceColumnId(sourceColumnId);

					// Remover de la columna origen
					setColumns((prev) => ({
						...prev,
						[sourceColumnId]: prev[sourceColumnId].filter(
							(item) => item.id !== reminderIdNum
						),
					}));
					return;
				}

				// Para otras columnas
				const today = new Date();
				const formattedDate = `${String(today.getDate()).padStart(
					2,
					'0'
				)}/${String(today.getMonth() + 1).padStart(
					2,
					'0'
				)}/${today.getFullYear()}`;

				const updatedReminder = {
					...reminder,
					description:
						targetColumnId === 'HOY'
							? `${formattedDate} - ${reminder.description.split(' - ')[1]}`
							: reminder.description,
				};

				setColumns((prev) => ({
					...prev,
					[sourceColumnId]: prev[sourceColumnId].filter(
						(item) => item.id !== reminderIdNum
					),
					[targetColumnId]: sortColumnByDate([
						...prev[targetColumnId],
						updatedReminder,
					]),
				}));

				toast.success('✔️ Recordatorio movido exitosamente');
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
