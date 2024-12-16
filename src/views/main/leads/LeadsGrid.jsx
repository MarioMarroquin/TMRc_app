import { AgGridReact } from 'ag-grid-react';
import React, { useCallback, useMemo, useState } from 'react';
import {
	AssignmentTurnedIn,
	ContentPasteSearch,
	RequestQuote,
	WatchLater,
} from '@mui/icons-material';
import { Stack, Typography } from '@mui/material';
import { ProductStatus, RequestStatusList, ServiceType } from '@utils/enums';
import useWindowDimensions from '@hooks/use-windowDimensions';
import { format } from 'date-fns';

const checkStatus = (status, isSale) => {
	return status === 'FINISHED' && !isSale ? 'SIN CONCRETAR' : status;
};

const CellStackRender = ({ children }) => (
	<Stack
		width={'100%'}
		direction={'row'}
		justifyContent={'flex-start'}
		alignItems={'center'}
		spacing={8}
		height={'100%'}
	>
		{children}
	</Stack>
);

const LeadsGrid = ({ rows, doubleClickAction, gridRef }) => {
	const { height, width } = useWindowDimensions();
	const [gridState, setGridState] = useState(
		JSON.parse(sessionStorage.getItem('gridState')) ?? {}
	);

	const defaultColDef = useMemo(() => {
		return {
			filter: true,
			floatingFilter: true,
		};
	}, []);

	// Column Definitions: Defines the columns to be displayed.
	const [colDefs, setColDefs] = useState([
		{
			field: 'requestStatus',
			headerName: 'Estatus',

			cellRenderer: ({ data, value }) => {
				const status = value;
				const isSale = data?.isSale;

				if (!status) {
					return '';
				} else if (status === 'PENDING') {
					return (
						<CellStackRender>
							<WatchLater color={'error'} />
							<Typography>{RequestStatusList[status].format}</Typography>
						</CellStackRender>
					);
				} else if (status === 'TRACING') {
					return (
						<CellStackRender>
							<ContentPasteSearch color={'warning'} />
							<Typography>{RequestStatusList[status].format}</Typography>
						</CellStackRender>
					);
				} else if (status === 'QUOTED') {
					return (
						<CellStackRender>
							<RequestQuote color={'info'} />
							<Typography>{RequestStatusList[status].format}</Typography>
						</CellStackRender>
					);
				} else {
					return (
						<CellStackRender>
							<AssignmentTurnedIn
								sx={{ color: isSale ? '#2e7d32' : '#F8A424' }}
							/>
							<Typography>
								{isSale ? RequestStatusList[status].format : 'SIN CONCRETAR'}
							</Typography>
						</CellStackRender>
					);
				}
			},
		},
		{ field: 'shortId', headerName: 'Folio' },
		{
			field: 'requestDate',
			headerName: 'Fecha - Hora',
			valueFormatter: ({ value }) =>
				format(new Date(value), 'dd/MM/yyyy - HH:mm'),
		},
		{
			field: 'assignedUser',
			headerName: 'Asesor',
			valueGetter: ({ data }) =>
				`${data.assignedUser.firstName} ${data.assignedUser.lastName}`,
		},
		{
			field: 'brand',
			headerName: 'Marca',
			valueGetter: ({ data }) => data?.brand.name,
		},
		{
			field: 'serviceType',
			headerName: 'Servicio',
			valueFormatter: ({ value }) => ServiceType[value],
		},

		{ field: 'contactMedium', headerName: 'Medio de Contacto' },
		// { field: 'advertisingMedium', headerName: 'Medio de Publicidad' },
		{
			field: 'productStatus',
			headerName: 'Estado Fisico',
			valueFormatter: ({ value }) => ProductStatus[value],
		},
		// { field: 'comments', headerName: 'Comentarios' },
		{
			field: 'company',
			headerName: 'Empresa',
			valueGetter: ({ data }) => data.company?.name,
		},
		{
			field: 'companyPhoneNumber',
			headerName: 'Teléfono de Empresa',
			valueGetter: ({ data }) => data.company?.phoneNumber,
		},
		{
			field: 'clientName',
			headerName: 'Cliente',
			valueGetter: ({ data }) =>
				!data.client?.id
					? null
					: `${data.client?.firstName} ${data.client?.lastName}`,
		},
		{
			field: 'clientPhoneNumber',
			headerName: 'Teléfono de Cliente',
			valueGetter: ({ data }) => data.client?.phoneNumber,
		},
		{
			field: 'clientEmail',
			headerName: 'Email de Cliente',
			valueGetter: ({ data }) => data.client?.email,
		},
		{ field: 'extraComments', headerName: 'Observaciones' },
		{
			field: 'createdAt',
			headerName: 'Creado el',
			valueFormatter: ({ value }) =>
				format(new Date(value), 'dd/MM/yyyy - HH:mm'),
		},
		{
			field: 'updatedAt',
			headerName: 'Ultima Actualización',
			valueFormatter: ({ value }) =>
				format(new Date(value), 'dd/MM/yyyy - HH:mm'),
		},
		{
			field: 'createdBy',
			headerName: 'Creado por',
			valueGetter: ({ data }) =>
				`${data.createdBy.firstName} ${data.createdBy.lastName}`,
		},
		{
			field: 'isSale',
			headerName: 'Venta',
			valueGetter: ({ data }) => (data?.isSale ? 'SI' : 'NO'),
		},
	]);

	const onRenderedGoToPage = useCallback((params) => {
		const pageToNavigate = JSON.parse(
			sessionStorage.getItem('leadsCurrentPage')
		);
		params.api.paginationGoToPage(pageToNavigate);
	}, []);

	// access api directly within event handler
	const onPaginationChanged = useCallback((params) => {
		if (params.newPage) {
			let currentPage = params.api.paginationGetCurrentPage();

			sessionStorage.setItem('leadsCurrentPage', JSON.stringify(currentPage));
		}
	}, []);

	const saveGridState = useCallback((params) => {
		const actualState = params.state;
		// save only for session, not permanent.
		sessionStorage.setItem('gridState', JSON.stringify(actualState));
	}, []);

	return (
		<div
			className='ag-theme-quartz' // applying the Data Grid theme
			style={{ height: height - 170 }} // the Data Grid will fill the size of the parent container
		>
			<AgGridReact
				rowData={rows}
				defaultColDef={defaultColDef}
				columnDefs={colDefs}
				pagination={true}
				paginationAutoPageSize={true}
				onRowDoubleClicked={doubleClickAction}
				ref={gridRef}
				onFirstDataRendered={onRenderedGoToPage}
				onPaginationChanged={onPaginationChanged}
				loading={!rows.length}
				onStateUpdated={saveGridState}
				initialState={gridState}
			/>
		</div>
	);
};

LeadsGrid.propTypes = {};

export default LeadsGrid;
