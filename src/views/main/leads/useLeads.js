import { endOfMonth, startOfMonth } from 'date-fns';
import { useLoaderContext } from '@providers/loader';
import { useMutation, useQuery } from '@apollo/client';
import { GET_REQUESTS } from '@views/main/requests/queryRequests';
import { useEffect, useState } from 'react';
import { useLeadsMRTContext } from '@providers/local/LeadsMRT/provider';

const useLeads = () => {
	const loader = useLoaderContext();
	const [filterMenuVisible, setFilterMenuVisible] = useState(false);
	const closeFilterMenu = () => setFilterMenuVisible(false);
	const openFilterMenu = () => setFilterMenuVisible(true);

	const {
		showAll,
		setShowAll,
		selectedSeller,
		setSelectedSeller,
		dateRange,
		setDateRange,
		showPending,
		setShowPending,
		paginationModel,
		setCountRows,
	} = useLeadsMRTContext();

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
		if (data) {
			const aux = data.requests.results;
			const auxCount = data.requests.info.count;

			// console.log('Requests: ', aux);
			// console.log('auxCount', auxCount);
			setCountRows(auxCount);
		}
	}, [data]);

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
	};
};
export default useLeads;
