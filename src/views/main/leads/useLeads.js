import { endOfMonth, startOfMonth } from 'date-fns';
import { useLoaderContext } from '@providers/loader';
import { useQuery } from '@apollo/client';
import { GET_REQUESTS } from '@views/main/requests/queryRequests';
import { useEffect, useState } from 'react';

const useLeads = () => {
	const loader = useLoaderContext();
	const [filterMenuVisible, setFilterMenuVisible] = useState(false);
	const closeFilterMenu = () => setFilterMenuVisible(false);
	const openFilterMenu = () => setFilterMenuVisible(true);

	// Settings States
	// Global filters for useQuery
	const [selectedSeller, setSelectedSeller] = useState(
		JSON.parse(sessionStorage.getItem('seller')) ?? {}
	);

	const [dateRange, setDateRange] = useState([
		{
			startDate: startOfMonth(new Date()),
			endDate: endOfMonth(new Date()),
			key: 'selection',
		},
	]);

	// Muestra las propias o todas
	const [showAll, setShowAll] = useState(
		JSON.parse(sessionStorage.getItem('show')) ?? true
	);

	const [showPending, setShowPending] = useState(
		JSON.parse(sessionStorage.getItem('pending')) ?? false
	);

	const [columnSizeModel, setColumnSizeModel] = useState({});

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

	const [paginationModel, setPaginationModel] = useState({
		pageIndex: 0,
		pageSize: 30,
	});

	const { data, error, loading, refetch } = useQuery(GET_REQUESTS, {
		variables: {
			showAll,
			assignedUserId: selectedSeller.id,
			dateRange: {
				end: dateRange[0].endDate,
				start: dateRange[0].startDate,
			},
			params: {
				page: paginationModel.pageIndex,
				pageSize: paginationModel.pageSize,
			},
			pending: showPending,
		},
	});

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
		const items = JSON.parse(sessionStorage.getItem('seller'));
		if (items) {
			setSelectedSeller(items);
		}
	}, []);

	useEffect(() => {
		const items = JSON.parse(sessionStorage.getItem('show'));
		if (items) {
			setShowAll(items);
		}
	}, []);

	useEffect(() => {
		const items = JSON.parse(sessionStorage.getItem('pending'));
		if (items) {
			setShowPending(items);
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

	return {
		allLeads: { showAll, setShowAll },
		assignedUser: { selected: selectedSeller, onChange: setSelectedSeller },
		date: { dateRange, setDateRange },
		filterMenu: {
			visible: filterMenuVisible,
			onClose: closeFilterMenu,
			onOpen: openFilterMenu,
		},
		leads: {
			count: data?.requests.info.count ?? 0,
			list: data?.requests.results ?? [],
			fetch: refetch,
			loading,
		},
		pending: { showPending, setShowPending },
		table: {
			columnOrder: { model: columnOrderModel, onChange: setColumnOrderModel },
			columnSize: { model: columnSizeModel, onChange: setColumnSizeModel },
			columnVisibility: {
				model: columnVisibilityModel,
				onChange: setColumnVisibilityModel,
			},
			pagination: { model: paginationModel, onChange: setPaginationModel },
		},
	};
};
export default useLeads;
