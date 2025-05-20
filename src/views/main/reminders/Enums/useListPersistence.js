import { useEffect } from 'react';

export const useListPersistence = (
	listData,
	setListData,
	completedList,
	setCompletedList
) => {
	// Cargar datos iniciales
	useEffect(() => {
		try {
			const storedListData = JSON.parse(localStorage.getItem('listData')) || [];
			const storedCompletedList =
				JSON.parse(localStorage.getItem('completedList')) || [];

			setListData(storedListData);
			setCompletedList(storedCompletedList);
		} catch (error) {
			console.error('Error al cargar datos del localStorage:', error);
		}
	}, []);

	// Persistir cambios en listData
	useEffect(() => {
		try {
			localStorage.setItem('listData', JSON.stringify(listData));
			// Notificar a otros componentes
			window.dispatchEvent(new Event('listDataUpdate'));
		} catch (error) {
			console.error('Error al guardar listData en localStorage:', error);
		}
	}, [listData]);

	// Persistir cambios en completedList
	useEffect(() => {
		try {
			localStorage.setItem('completedList', JSON.stringify(completedList));
			// Notificar a otros componentes
			window.dispatchEvent(new Event('completedListUpdate'));
		} catch (error) {
			console.error('Error al guardar completedList en localStorage:', error);
		}
	}, [completedList]);

	// Función auxiliar para actualizar listData
	const updateListData = (newData) => {
		try {
			setListData(newData);
			localStorage.setItem('listData', JSON.stringify(newData));
			window.dispatchEvent(new Event('listDataUpdate'));
		} catch (error) {
			console.error('Error al actualizar listData:', error);
		}
	};

	// Función auxiliar para actualizar completedList
	const updateCompletedList = (newData) => {
		try {
			setCompletedList(newData);
			localStorage.setItem('completedList', JSON.stringify(newData));
			window.dispatchEvent(new Event('completedListUpdate'));
		} catch (error) {
			console.error('Error al actualizar completedList:', error);
		}
	};

	return {
		updateListData,
		updateCompletedList,
	};
};
