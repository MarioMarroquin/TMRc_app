import { useQuery } from '@apollo/client';
import { GET_LEAD_REMINDERS } from './queryLeadReminders';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { reminderData } from '@views/main/reminders/ReminderData.js';
import { parse, isBefore, isAfter, isToday } from 'date-fns';

export const useReminders = () => {
	const [completedList, setCompletedList] = useState(() => {
		const saved = localStorage.getItem('completedList');
		return saved ? JSON.parse(saved) : [];
	});

	useEffect(() => {
		localStorage.setItem('completedList', JSON.stringify(completedList));
	}, [completedList]);

	const [openDialog, setOpenDialog] = useState(false);
	const [selectedItem, setSelectedItem] = useState(null);

	const [selectedView, setSelectedView] = useState(() => {
		const saved = localStorage.getItem('selectedView');
		return saved;
	});
	useEffect(() => {
		localStorage.setItem('selectedView', selectedView);
	}, [selectedView]);

	const currentData = reminderData[selectedView] || [];
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
		const currentData = reminderData[selectedView] || [];

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
			reminderData,
			completedIds,
			deletedIds
		);
		setColumns(kanbanColumns);
	}, [selectedView]);

	const ListoClick = (subItem, fecha) => {
		const newCompleted = [...completedList, { ...subItem, FECHA: fecha }];

		// Guardar en localStorage
		localStorage.setItem('completedList', JSON.stringify(newCompleted));
		setCompletedList(newCompleted);

		// Quitar de la lista activa
		setListData((prevData) =>
			prevData
				.map((item) =>
					item.FECHA === fecha
						? {
								...item,
								LIST: item.LIST.filter((task) => task.id !== subItem.id),
						  }
						: item
				)
				.filter((item) => item.LIST.length > 0)
		);
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
	};

	const handleCancelDelete = () => {
		setOpenDialog(false);
		setSelectedItem(null);
	};
	const getToday = () => {
		const today = new Date();
		const dd = today.getDate(); // sin padStart
		const mm = today.getMonth() + 1; // sin padStart
		const yyyy = today.getFullYear();
		return `${dd}/${mm}/${yyyy}`; // sin ceros
	};

	const formatReminderDataForKanban = (reminderData, deletedItems = []) => {
		const allReminders = [
			...(reminderData.pasado || []),
			...(reminderData.hoy || []),
		].sort((a, b) => {
			const dateA = new Date(a.FECHA);
			const dateB = new Date(b.FECHA);
			return dateA - dateB;
		});

		const today = new Date();

		const columnsFormatted = {
			VENCIDO: [],
			HOY: [],
			'POR VENCER': [],
		};

		allReminders.forEach((grupo) => {
			const fecha = parse(grupo.FECHA, 'yyyy/MM/dd', new Date());

			let status = '';
			if (isBefore(fecha, today)) {
				status = 'VENCIDO';
			} else if (isToday(fecha)) {
				status = 'HOY';
			} else if (isAfter(fecha, today)) {
				status = 'POR VENCER';
			}

			const [year, month, day] = grupo.FECHA.split('/');
			const formattedDate = `${day}/${month}/${year}`;

			grupo.LIST.forEach((item) => {
				if (!deletedItems.includes(item.id)) {
					columnsFormatted[status].push({
						id: item.FOLIO,
						title: item.SERVICIO,
						description: formattedDate,
					});
				}
			});
		});

		return columnsFormatted;
	};

	const onDragEnd = (result) => {
		const { source, destination } = result;

		// Si no se suelta en un destino válido
		if (!destination) return;

		// Si se suelta en la misma posición
		if (
			source.droppableId === destination.droppableId &&
			source.index === destination.index
		) {
			return;
		}

		const sourceColumn = columns[source.droppableId];
		const destColumn = columns[destination.droppableId];
		const [movedItem] = sourceColumn.splice(source.index, 1);

		destColumn.splice(destination.index, 0, movedItem);

		setColumns({
			...columns,
			[source.droppableId]: sourceColumn,
			[destination.droppableId]: destColumn,
		});
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
		const updatedDeletedItems = [
			...deletedItems,
			...completedList.map((item) => item.id),
		];

		setDeletedItems(updatedDeletedItems);
		localStorage.setItem('deletedItems', JSON.stringify(updatedDeletedItems));

		setCompletedList([]); // Vacía la lista visual de completados
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
	};
};
