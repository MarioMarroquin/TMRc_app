import { useEffect } from 'react';

export const useListPersistence = (
	listData,
	setListData,
	completedList,
	setCompletedList
) => {
	// Un solo useEffect para ambas actualizaciones
	useEffect(() => {
		const saveToLocalStorage = () => {
			try {
				if (listData) {
					localStorage.setItem('listData', JSON.stringify(listData));
				}
				if (completedList) {
					localStorage.setItem('completedList', JSON.stringify(completedList));
				}
			} catch (error) {
				console.error('Error saving data:', error);
			}
		};

		saveToLocalStorage();
	}, [listData, completedList]);

	// Funciones auxiliares simplificadas
	const updateListData = (newData) => {
		if (!newData) return;
		setListData(newData);
	};

	const updateCompletedList = (newData) => {
		if (!newData) return;
		setCompletedList(newData);
	};

	return {
		updateListData,
		updateCompletedList,
	};
};
