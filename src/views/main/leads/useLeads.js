import { endOfMonth, startOfMonth } from 'date-fns';
import { useLoaderContext } from '@providers/loader';
import { useMutation, useQuery } from '@apollo/client';
import { GET_REQUESTS } from '@views/main/requests/queryRequests';
import { useEffect, useState } from 'react';
import { useLeadsMRTContext } from '@providers/local/LeadsMRT/provider';
import exportExcelReport from '@views/main/requests/exportExcelReport';
import exportExcelTable from '@views/main/requests/exportExcelTable';

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
			dateRange: {
				end: dateRange[0].endDate,
				start: dateRange[0].startDate,
			},
			pending: showPending,
		},
	});

	const exportToExcel = async (gridRef, exportType) => {
		const leadNodesToExport = [];

		const columnDefs = gridRef.current.api.getColumnDefs();

		switch (exportType) {
			case 'All':
				await gridRef.current.api.forEachNode((node) => {
					leadNodesToExport.push(node);
				});
				break;
			case 'AfterFilter':
				await gridRef.current.api.forEachNodeAfterFilter((node) => {
					leadNodesToExport.push(node);
				});

				break;
			case 'AfterFilterAndSort':
				await gridRef.current.api.forEachNodeAfterFilterAndSort((node) => {
					leadNodesToExport.push(node);
				});
				break;
		}

		// exportExcelReport(leadsToExport);
		exportExcelTable(columnDefs, leadNodesToExport, gridRef);

		// let l = gridRef.current.api.getModel();
		// console.log(l);l
	};

	const exportToExcelDefault = async (gridRef) => {
		const leadsToExport = [];

		await gridRef.current.api.forEachNode((node) => {
			leadsToExport.push(node.data);
		});

		exportExcelReport(leadsToExport);
	};

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
			list: data?.requests.results ?? [],
			fetch: refetch,
			loading,
		},
		pending: { showPending, setShowPending },
		exportToExcel,
		exportToExcelDefault,
	};
};
export default useLeads;
