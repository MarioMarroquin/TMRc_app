import { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { endOfMonth, startOfMonth } from 'date-fns';

const RequestsContext = createContext({
	// loading: false,
	// setLoading: null,
});

const RequestsProvider = ({ children }) => {
	const [countRows, setCountRows] = useState(0);
	const [showPending, setShowPending] = useState(false);

	const [paginationModel, setPaginationModel] = useState({
		page: 0,
		pageSize: 10,
	});

	const [dateRange, setDateRange] = useState([
		{
			startDate: startOfMonth(new Date()),
			endDate: endOfMonth(new Date()),
			key: 'selection',
		},
	]);

	const [columnVisibilityModel, setColumnVisibilityModel] = useState({
		contactMedium: false,
		advertisingMedium: false,
		brand: false,
		productStatus: false,
		comments: false,
		company: false,
		client: false,
		extraComments: false,
		updatedAt: false,
		createdAt: false,
	});

	const resetFilters = () => {
		setCountRows(0);
		setShowPending(false);

		setPaginationModel({
			page: 0,
			pageSize: 10,
		});

		setDateRange([
			{
				startDate: startOfMonth(new Date()),
				endDate: endOfMonth(new Date()),
				key: 'selection',
			},
		]);
	};

	const value = {
		countRows,
		setCountRows,
		showPending,
		setShowPending,
		paginationModel,
		setPaginationModel,
		dateRange,
		setDateRange,
		columnVisibilityModel,
		setColumnVisibilityModel,
		resetFilters,
	};

	useEffect(() => {
		const items = JSON.parse(localStorage.getItem('headersVisibility'));
		if (items) {
			setColumnVisibilityModel(items);
		}
	}, []);

	useEffect(() => {
		localStorage.setItem(
			'headersVisibility',
			JSON.stringify(columnVisibilityModel)
		);
	}, [columnVisibilityModel]);

	return (
		<RequestsContext.Provider value={value}>
			{children}
		</RequestsContext.Provider>
	);
};

RequestsProvider.propTypes = {
	children: PropTypes.element.isRequired,
};

export { RequestsContext };
export default RequestsProvider;
