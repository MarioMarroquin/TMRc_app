import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { format, addDays } from 'date-fns';
import { reminderData } from '@views/main/reminders/ReminderData.js';

export const useKanban = () => {
	const transformReminderDataToKanban = () => {
		const initialColumns = {
			VENCIDO: [],
			HOY: [],
			'POR VENCER': [],
		};

		const formatDate = (dateString, hora) => {
			const [year, month, day] = dateString.split('/');
			return `${day.padStart(2, '0')}/${month.padStart(
				2,
				'0'
			)}/${year} - ${hora}`;
		};

		// Procesar datos de "pasado" para la columna VENCIDO
		if (reminderData.pasado) {
			reminderData.pasado.forEach((group) => {
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
		}

		// Procesar datos de "hoy" para la columna HOY
		if (reminderData.hoy) {
			reminderData.hoy.forEach((group) => {
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
		}

		// Ordenar cada columna por fecha (de más reciente a más antigua)
		Object.keys(initialColumns).forEach((columnId) => {
			initialColumns[columnId].sort((a, b) => {
				const [dateA] = a.description.split(' - ');
				const [dateB] = b.description.split(' - ');
				const [dayA, monthA, yearA] = dateA.split('/');
				const [dayB, monthB, yearB] = dateB.split('/');
				// Invertimos el orden de la comparación para ordenar de más reciente a más antigua
				return (
					new Date(`${yearB}-${monthB}-${dayB}`) -
					new Date(`${yearA}-${monthA}-${dayA}`)
				);
			});
		});

		return initialColumns;
	};

	// Estados
	const [columns, setColumns] = useState(() => {
		const saved = localStorage.getItem('kanbanColumns');
		if (saved) {
			try {
				return JSON.parse(saved);
			} catch (error) {
				console.error('Error parsing saved kanban data:', error);
				return transformReminderDataToKanban();
			}
		}
		return transformReminderDataToKanban();
	});

	// Estados para modales
	const [modalOpen, setModalOpen] = useState(false);
	const [quickModalOpen, setQuickModalOpen] = useState(false);
	const [selectedReminder, setSelectedReminder] = useState(null);
	const [activeColumn, setActiveColumn] = useState(null);
	const [quickModalColumn, setQuickModalColumn] = useState(null);
	const [itemToEdit, setItemToEdit] = useState(null);
	const [tempRemovedItem, setTempRemovedItem] = useState(null);
	const [sourceColumnId, setSourceColumnId] = useState(null);

	// Estados para formularios
	const [selectedDate, setSelectedDate] = useState('');
	const [selectedTime, setSelectedTime] = useState('');
	const [title, setTitle] = useState('');

	// Efecto para persistir en localStorage
	useEffect(() => {
		if (Object.keys(columns).length > 0) {
			localStorage.setItem('kanbanColumns', JSON.stringify(columns));
		}
	}, [columns]);

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

		setColumns((prev) => ({
			...prev,
			[activeColumn]: [...prev[activeColumn], newReminder],
		}));

		handleCloseModal();
		toast.success('✔️ Recordatorio creado');
	};

	const handleCardEditSave = () => {
		if (!itemToEdit) return;

		const updatedReminder = {
			...itemToEdit,
			description: `${selectedDate} - ${selectedTime}`,
			title: title,
		};

		setColumns((prev) => {
			const newColumns = { ...prev };
			const targetColumn = activeColumn || 'POR VENCER';

			if (sourceColumnId) {
				newColumns[sourceColumnId] = newColumns[sourceColumnId].filter(
					(item) => item.id !== itemToEdit.id
				);
			}

			if (!newColumns[targetColumn]) {
				newColumns[targetColumn] = [];
			}
			newColumns[targetColumn].push(updatedReminder);

			return newColumns;
		});

		handleCloseModal();
		toast.success('✔️ Recordatorio actualizado');
	};

	const handleQuickReminderSave = () => {
		const newReminder = {
			id: Date.now(),
			title,
			description: `${selectedDate} - ${selectedTime}`,
			type: 'personal',
		};

		setColumns((prev) => ({
			...prev,
			[quickModalColumn]: [...prev[quickModalColumn], newReminder],
		}));

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
		setTempRemovedItem(null);
		setSourceColumnId(null);
		resetForm();
	};

	const handleCloseQuickModal = () => {
		setQuickModalOpen(false);
		setQuickModalColumn(null);
		resetForm();
	};

	const handleOpenModal = (columnId, reminder = null) => {
		setSelectedReminder(reminder);
		setActiveColumn(columnId);
		setModalOpen(true);
		if (reminder) {
			setItemToEdit(reminder);
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

	const sortColumnByDate = (cards) => {
		return cards.sort((a, b) => {
			const [dateA] = a.description.split(' - ');
			const [dateB] = b.description.split(' - ');
			const [dayA, monthA, yearA] = dateA.split('/');
			const [dayB, monthB, yearB] = dateB.split('/');
			return (
				new Date(`${yearB}-${monthB}-${dayB}`) -
				new Date(`${yearA}-${monthA}-${dayA}`)
			);
		});
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
				setColumns((prev) => {
					const updatedColumns = {
						...prev,
						[sourceColumnId]: prev[sourceColumnId].filter(
							(item) => item.id !== reminderIdNum
						),
						[targetColumnId]: sortColumnByDate([
							...prev[targetColumnId],
							reminder,
						]),
					};
					return updatedColumns;
				});

				toast.success('✔️ Recordatorio movido exitosamente');
			}
		}
	};

	const deleteReminder = (id, columnId) => {
		setColumns((prev) => ({
			...prev,
			[columnId]: prev[columnId].filter((item) => item.id !== id),
		}));
		toast.error('🗑️ Recordatorio eliminado');
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
	};
};
