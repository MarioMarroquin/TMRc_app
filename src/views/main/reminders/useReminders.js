import { useQuery } from '@apollo/client';
import { GET_LEAD_REMINDERS } from './queryLeadReminders';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { reminderData } from '@views/main/reminders/ReminderData.js';
import { parse, isBefore, isAfter, isToday } from 'date-fns';

export const useReminders = () => {
	const [completedList, setCompletedList] = useState([]);
	const [openDialog, setOpenDialog] = useState(false);
	const [selectedItem, setSelectedItem] = useState(null);
	const [selectedView, setSelectedView] = useState('hoy');
	const currentData = reminderData[selectedView] || [];
	const [listData, setListData] = useState(currentData);
	const [columns, setColumns] = useState({});
	const [openEditDialog, setOpenEditDialog] = useState(false);
	const [itemToEdit, setItemToEdit] = useState(null);

	useEffect(() => {
		const currentData = reminderData[selectedView] || [];
		setListData(currentData);

		// Formatea columnas para Kanban al cambiar la vista
		const kanbanColumns = formatReminderDataForKanban(reminderData);
		setColumns(kanbanColumns);
	}, [selectedView]);

	const ListoClick = (subItem, fecha) => {
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

		setCompletedList((prev) => [...prev, { ...subItem, FECHA: fecha }]);
	};

	const handleDeleteClick = (item) => {
		setSelectedItem(item);
		setOpenDialog(true);
	};

	const handleConfirmDelete = () => {
		if (!selectedItem) return;

		const updatedListData = listData
			.map((group) => {
				return {
					...group,
					LIST: group.LIST.filter((item) => item.id !== selectedItem.id),
				};
			})
			.filter((group) => group.LIST.length > 0);

		setListData(updatedListData);
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

	const formatReminderDataForKanban = (reminderData) => {
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
				columnsFormatted[status].push({
					id: item.FOLIO,
					title: item.SERVICIO,
					description: formattedDate,
				});
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
		setCompletedList([]); // Vaciar la lista de "Listo"
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
