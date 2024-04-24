import { createContext, useContext, useEffect, useState } from 'react';
import { endOfMonth, startOfMonth } from 'date-fns';

const LeadsMRTContext = createContext({});

const InitialSeller = {
	id: undefined,
	firstName: '',
	lastName: '',
	get name() {
		return (this.firstName + ' ' + this.lastName).trim();
	},
};

const LeadsMRTProvider = ({ children }) => {
	const [countRows, setCountRows] = useState(0);

	// Muestra las propias o todas
	const [showAll, setShowAll] = useState(
		JSON.parse(sessionStorage.getItem('show')) ?? true
	);

	const [showPending, setShowPending] = useState(
		JSON.parse(sessionStorage.getItem('pending')) ?? false
	);

	const [columnSizeModel, setColumnSizeModel] = useState({});

	const [dateRange, setDateRange] = useState([
		{
			startDate: startOfMonth(new Date()),
			endDate: endOfMonth(new Date()),
			key: 'selection',
		},
	]);

	const [paginationModel, setPaginationModel] = useState({
		pageIndex: 0,
		pageSize: 30,
	});

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

	// Settings States
	// Global filters for useQuery
	const [selectedSeller, setSelectedSeller] = useState(
		JSON.parse(sessionStorage.getItem('seller')) ?? InitialSeller
	);

	useEffect(() => {
		const items = JSON.parse(sessionStorage.getItem('date'));

		if (items) {
			setDateRange([
				{
					startDate: new Date(
						JSON.parse(sessionStorage.getItem('date'))[0].startDate
					),
					endDate: new Date(
						JSON.parse(sessionStorage.getItem('date'))[0].endDate
					),
					key: 'selection',
				},
			]);
		}
	}, []);

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

	// Save props on change

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

	useEffect(() => {
		sessionStorage.setItem('date', JSON.stringify(dateRange));
	}, [dateRange]);

	useEffect(() => {
		sessionStorage.setItem('pending', JSON.stringify(showPending));
	}, [showPending]);

	useEffect(() => {
		sessionStorage.setItem('show', JSON.stringify(showAll));
	}, [showAll]);

	useEffect(() => {
		sessionStorage.setItem('seller', JSON.stringify(selectedSeller));
	}, [selectedSeller]);

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
	};

	return (
		<LeadsMRTContext.Provider value={value}>
			{children}
		</LeadsMRTContext.Provider>
	);
};

function useLeadsMRTContext() {
	return useContext(LeadsMRTContext);
}

export { LeadsMRTProvider, useLeadsMRTContext };
