import { reminderData } from './ReminderData';
import toast from 'react-hot-toast';

export const useResetData = (
	setListData,
	setCompletedList,
	setDeletedItems,
	setColumns
) => {
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

		// Procesar datos pasados para VENCIDO
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
					FECHA: group.FECHA,
					HORA: item.HORA,
				});
			});
		});

		// Procesar datos de hoy
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
					FECHA: group.FECHA,
					HORA: item.HORA,
				});
			});
		});

		// Procesar datos por vencer
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
					FECHA: group.FECHA,
					HORA: item.HORA,
				});
			});
		});

		return initialColumns;
	};

	const resetAllData = () => {
		if (
			window.confirm(
				'¿Estás seguro de que quieres resetear todos los datos? Esta acción no se puede deshacer.'
			)
		) {
			try {
				// Limpiar localStorage primero
				localStorage.clear();

				// Crear copia profunda de los datos originales
				const originalListData = JSON.parse(JSON.stringify(reminderData));
				const kanbanData = transformReminderDataToKanban();

				// Resetear estados
				setCompletedList([]);
				if (typeof setDeletedItems === 'function') {
					setDeletedItems([]);
				}

				// Resetear la lista
				setListData(originalListData);

				// Resetear el Kanban
				if (typeof setColumns === 'function') {
					setColumns(kanbanData);
				}

				// Guardar en localStorage
				localStorage.setItem('listData', JSON.stringify(originalListData));
				localStorage.setItem('completedList', JSON.stringify([]));
				localStorage.setItem('deletedItems', JSON.stringify([]));
				localStorage.setItem('kanbanColumns', JSON.stringify(kanbanData));

				// Disparar eventos con la estructura correcta
				window.dispatchEvent(
					new CustomEvent('listDataUpdate', {
						detail: originalListData,
					})
				);

				window.dispatchEvent(
					new CustomEvent('kanbanUpdate', {
						detail: kanbanData,
					})
				);

				toast.success('✔️ Datos restablecidos completamente');
			} catch (error) {
				console.error('Error al resetear datos:', error);
				toast.error('Error al resetear los datos');
			}
		}
	};

	return { resetAllData };
};
