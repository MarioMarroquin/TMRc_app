import { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { endOfMonth, startOfMonth } from 'date-fns';

const RequestsContext = createContext({
	// loading: false,
	// setLoading: null,
});

const InitialSeller = {
	id: undefined,
	firstName: '',
	lastName: '',
	get name() {
		return (this.firstName + ' ' + this.lastName).trim();
	},
};

const RequestsProvider = ({ children }) => {
	const [countRows, setCountRows] = useState(0);
	const [showPending, setShowPending] = useState(false);

	const [paginationModel, setPaginationModel] = useState({
		pageIndex: 0,
		pageSize: 30,
	});

	const [dateRange, setDateRange] = useState([
		{
			startDate: startOfMonth(new Date()),
			endDate: endOfMonth(new Date()),
			key: 'selection',
		},
	]);

	const [columnVisibilityModel, setColumnVisibilityModel] = useState({
		extraComments: false,
		updatedAt: false,
		createdAt: false,
	});

	const [columnOrderModel, setColumnOrderModel] = useState([
		'requestStatusIcon',
		'requestStatus',
		'shortId',
		'requestDate',
		'assignedUser',
		'brand',
		'serviceType',
		'contactMedium',
		'advertisingMedium',
		'productStatus',
		'comments',
		'company',
		'clientName',
		'clientPhoneNumber',
		'extraComments',
		'createdAt',
		'updatedAt',
		'createdBy',
		'isSale',
	]);
	const [columnSizeModel, setColumnSizeModel] = useState({});

	const [showAll, setShowAll] = useState(true); // Muestra las propias o todas
	const [selectedSeller, setSelectedSeller] = useState(InitialSeller);

	const resetFilters = () => {
		setShowPending(false);

		setPaginationModel({
			pageIndex: 0,
			pageSize: 30,
		});

		setDateRange([
			{
				startDate: startOfMonth(new Date()),
				endDate: endOfMonth(new Date()),
				key: 'selection',
			},
		]);

		setShowAll(true);
		setSelectedSeller(InitialSeller);
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
		showAll,
		setShowAll,
		selectedSeller,
		setSelectedSeller,
		columnOrderModel,
		setColumnOrderModel,
		columnSizeModel,
		setColumnSizeModel,
		resetFilters,
	};

	useEffect(() => {
		const items = JSON.parse(localStorage.getItem('headersVisibility'));
		if (items) {
			setColumnVisibilityModel(items);
		}
	}, []);

	useEffect(() => {
		const items = JSON.parse(localStorage.getItem('headersOrder'));
		if (items) {
			setColumnOrderModel(items);
		}
	}, []);

	useEffect(() => {
		const items = JSON.parse(localStorage.getItem('headersSize'));
		if (items) {
			setColumnSizeModel(items);
		}
	}, []);

	useEffect(() => {
		const items = JSON.parse(localStorage.getItem('pageSize'));
		if (items) {
			setPaginationModel({ pageIndex: 0, pageSize: items?.pageSize });
		}
	}, []);

	useEffect(() => {
		localStorage.setItem(
			'headersVisibility',
			JSON.stringify(columnVisibilityModel)
		);
	}, [columnVisibilityModel]);

	useEffect(() => {
		localStorage.setItem('headersOrder', JSON.stringify(columnOrderModel));
	}, [columnOrderModel]);

	useEffect(() => {
		localStorage.setItem('headersSize', JSON.stringify(columnSizeModel));
	}, [columnSizeModel]);

	useEffect(() => {
		localStorage.setItem('pageSize', JSON.stringify(paginationModel));
	}, [paginationModel]);

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
