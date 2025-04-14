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
	useEffect(() => {
		const currentData = reminderData[selectedView] || [];
		setListData(currentData);
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
		];
		const today = new Date();

		const colummns = {
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

			grupo.LIST.forEach((item) => {
				colummns[status].push({
					id: item.FOLIO,
					title: item.SERVICIO,
					description: grupo.FECHA,
				});
			});
		});

		return colummns;
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
	};
};
