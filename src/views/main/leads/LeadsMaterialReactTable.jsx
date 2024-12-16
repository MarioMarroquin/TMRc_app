import React, { Fragment, useMemo, useRef } from 'react';
import {
	MaterialReactTable,
	useMaterialReactTable,
} from 'material-react-table';
import { MRT_Localization_ES as es } from 'material-react-table/locales/es';
import {
	AssignmentTurnedIn,
	ContentPasteSearch,
	RequestQuote,
	WatchLater,
} from '@mui/icons-material';
import { Box, Button, Stack, Tooltip, Typography } from '@mui/material';
import { ProductStatus, RequestStatusList, ServiceType } from '@utils/enums';
import { format } from 'date-fns';
import exportExcelReport from '@views/main/requests/exportExcelReport';
import PermissionsGate from '@components/PermissionsGate';
import { SCOPES_REQUEST } from '@config/permisissions/permissions';
import exportExcelTable from '@views/main/requests/exportExcelTable';
import { useLeadsMRTContext } from '@providers/local/LeadsMRT/provider';

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
	>
		{children}
	</Stack>
);

const LeadsMaterialReactTable = ({ data, loading, goToRequest }) => {
	const {
		countRows,
		paginationModel,
		setPaginationModel,
		columnVisibilityModel,
		setColumnVisibilityModel,
		columnOrderModel,
		setColumnOrderModel,
		columnSizeModel,
		setColumnSizeModel,
	} = useLeadsMRTContext();

	const columns = useMemo(
		() => [
			{
				accessorFn: (row) => checkStatus(row.requestStatus, row?.isSale),
				id: 'requestStatus',
				header: 'ESTATUS',
				size: 170,
				minSize: 140,
				maxSize: 180,
				Cell: ({ cell }) => {
					const value = cell.getValue();
					const isSale = cell.row.original.isSale;

					if (!value) {
						return '';
					} else if (value === 'PENDING') {
						return (
							<CellStackRender>
								<WatchLater color={'error'} />
								<Typography>{RequestStatusList[value].format}</Typography>
							</CellStackRender>
						);
					} else if (value === 'TRACING') {
						return (
							<CellStackRender>
								<ContentPasteSearch color={'warning'} />
								<Typography>{RequestStatusList[value].format}</Typography>
							</CellStackRender>
						);
					} else if (value === 'QUOTED') {
						return (
							<CellStackRender>
								<RequestQuote color={'info'} />
								<Typography>{RequestStatusList[value].format}</Typography>
							</CellStackRender>
						);
					} else {
						return (
							<CellStackRender>
								<AssignmentTurnedIn
									sx={{ color: isSale ? '#2e7d32' : '#F8A424' }}
								/>
								<Typography>
									{isSale ? RequestStatusList[value].format : value}
								</Typography>
							</CellStackRender>
						);
					}
				},
				muiTableBodyCellProps: {
					align: 'center',
				},
			},
			{
				accessorKey: 'shortId',
				header: 'FOLIO',
				size: 130,
				minSize: 125,
				maxSize: 140,
				muiTableBodyCellProps: {
					align: 'right',
				},
			},
			{
				accessorFn: (row) =>
					format(new Date(row.requestDate), 'dd/MM/yyyy - HH:mm'),
				id: 'requestDate',
				header: 'FECHA - HORA',
				size: 175,
				minSize: 170,
				maxSize: 185,
				muiTableBodyCellProps: {
					align: 'center',
				},
			},
			{
				accessorFn: (row) =>
					`${row.assignedUser.firstName} ${row.assignedUser.lastName}`,
				id: 'assignedUser',
				header: 'ASESOR',
				size: 200,
				minSize: 185,
				maxSize: 215,
				muiTableBodyCellProps: {
					align: 'center',
				},
			},
			{
				accessorFn: (row) => row.brand?.name,
				id: 'brand',
				header: 'MARCA',
				size: 150,
				minSize: 135,
				maxSize: 165,
				muiTableBodyCellProps: {
					align: 'center',
				},
			},
			{
				accessorFn: (row) => ServiceType[row.serviceType],
				id: 'serviceType',
				header: 'SERVICIO',
				size: 150,
				minSize: 145,
				maxSize: 160,
				muiTableBodyCellProps: {
					align: 'center',
				},
			},
			{
				accessorKey: 'contactMedium',
				header: 'MEDIO DE CONTACTO',
				size: 215,
				minSize: 210,
				maxSize: 220,
				muiTableBodyCellProps: {
					align: 'center',
				},
			},
			{
				accessorKey: 'advertisingMedium',
				header: 'MEDIO DE PUBLICIDAD',
				size: 220,
				minSize: 215,
				maxSize: 225,
				muiTableBodyCellProps: {
					align: 'center',
				},
			},
			{
				accessorFn: (row) => ProductStatus[row.productStatus],
				id: 'productStatus',
				header: 'ESTADO FISICO',
				size: 180,
				minSize: 175,
				maxSize: 185,
				muiTableBodyCellProps: {
					align: 'center',
				},
			},
			{
				accessorKey: 'comments',
				header: 'COMENTARIOS',
				size: 185,
				minSize: 170,
				maxSize: 220,
				muiTableBodyCellProps: {
					align: 'left',
				},
			},
			{
				accessorFn: (row) => row.company?.name,
				id: 'company',
				header: 'EMPRESA',
				size: 160,
				minSize: 150,
				maxSize: 170,
				muiTableBodyCellProps: {
					align: 'left',
				},
			},
			{
				accessorFn: (row) =>
					`${row.client?.firstName ?? ''} ${row.client?.lastName ?? ''}`,
				id: 'clientName',
				header: 'CLIENTE',
				size: 180,
				minSize: 135,
				maxSize: 200,
				muiTableBodyCellProps: {
					align: 'left',
				},
			},
			{
				accessorFn: (row) => row.client?.phoneNumber,
				id: 'clientPhoneNumber',
				header: 'CLIENTE CELULAR',
				size: 190,
				minSize: 190,
				maxSize: 190,
				muiTableBodyCellProps: {
					align: 'left',
				},
			},
			{
				accessorFn: (row) => row.client?.email,
				id: 'clientEmail',
				header: 'CLIENTE EMAIL',
				size: 190,
				minSize: 190,
				maxSize: 190,
				muiTableBodyCellProps: {
					align: 'left',
				},
			},
			{
				accessorKey: 'extraComments',
				header: 'OBSERVACIONES',
				size: 200,
				minSize: 185,
				maxSize: 250,
				muiTableBodyCellProps: {
					align: 'left',
				},
			},
			{
				accessorFn: (row) =>
					format(new Date(row.createdAt), 'dd/MM/yyyy - HH:mm'),
				id: 'createdAt',
				header: 'FECHA DE CREACION',
				size: 210,
				minSize: 210,
				maxSize: 210,
				muiTableBodyCellProps: {
					align: 'center',
				},
			},
			{
				accessorFn: (row) =>
					format(new Date(row.updatedAt), 'dd/MM/yyyy - HH:mm'),
				id: 'updatedAt',
				header: 'ULT. ACTUALIZACION',
				size: 210,
				minSize: 210,
				maxSize: 210,
				muiTableBodyCellProps: {
					align: 'center',
				},
			},
			{
				accessorFn: (row) =>
					`${row.createdBy.firstName} ${row.createdBy.lastName}`,
				id: 'createdBy',
				header: 'CREADOR POR',
				size: 200,
				minSize: 185,
				maxSize: 215,
				muiTableBodyCellProps: {
					align: 'center',
				},
			},
			{
				accessorFn: (row) => (row?.isSale ? 'SI' : 'NO'),
				id: 'isSale',
				header: 'VENTA',
				size: 130,
				minSize: 130,
				maxSize: 130,
				muiTableBodyCellProps: {
					align: 'center',
				},
			},
		],
		[]
	);

	const rowVirtualizerInstanceRef = useRef(null);

	const table = useMaterialReactTable({
		columns,
		data,
		rowVirtualizerInstanceRef,
		rowVirtualizerOptions: { overscan: 5 }, //optionally customize the row virtualizer
		enableRowVirtualization: true,
		enableDensityToggle: false,
		enableColumnOrdering: true,
		enableColumnResizing: true,
		enableFullScreenToggle: false,
		manualPagination: true,
		rowCount: countRows,
		initialState: { density: 'compact' },
		state: {
			columnVisibility: columnVisibilityModel,
			pagination: paginationModel,
			showLoadingOverlay: loading,
			columnOrder: columnOrderModel,
			columnSizing: columnSizeModel,
		},
		columnResizeMode: 'onEnd',
		onPaginationChange: setPaginationModel,
		onColumnOrderChange: setColumnOrderModel,
		onColumnSizingChange: setColumnSizeModel,
		onColumnVisibilityChange: setColumnVisibilityModel,
		muiTableContainerProps: {
			sx: { height: { xs: 'calc(100vh - 400px)', md: 'calc(100vh - 330px)' } },
		},
		muiPaginationProps: {
			rowsPerPageOptions: [1, 15, 30, 50, 100, 250, 500, 700, 2000],
		},
		enableStickyHeader: true,
		muiTableBodyRowProps: ({ row }) => ({
			onDoubleClick: (event) => {
				goToRequest(row.original);
			},
			sx: {
				cursor: 'pointer',
			},
		}),
		muiTopToolbarProps: {
			sx: {
				backgroundColor: 'transparent',
			},
		},
		muiBottomToolbarProps: {
			sx: {
				backgroundColor: 'transparent',
				boxShadow: 'none',
				borderTop: `1px solid rgb(240, 240, 240)`,
			},
		},
		muiTablePaperProps: {
			sx: {
				width: '100%',
				boxShadow: 'none',
				backgroundColor: 'transparent',
			},
		},
		muiTableHeadCellProps: {
			sx: {
				fontSize: 11,
				fontWeight: 'bold',
				color: 'text.secondary',
				borderBottom: `1px solid rgb(240, 240, 240)`,
				backgroundColor: 'white',
			},
		},
		muiTableBodyCellProps: {
			sx: {
				borderBottom: 'none',
				boxShadow: 'none',
				backgroundColor: 'transparent',
			},
		},
		renderTopToolbarCustomActions: ({ table }) => (
			<Fragment>
				<Box
					sx={{
						display: 'flex',
						gap: '16px',
						padding: '8px',
						flexWrap: 'wrap',
					}}
				>
					<PermissionsGate scopes={[SCOPES_REQUEST.export]}>
						<Tooltip title={'Formato clásico'} placement={'top'}>
							<Button
								variant={'text'}
								color={'primary'}
								onClick={() => {
									exportExcelReport(data);
								}}
							>
								Exportar a excel
							</Button>
						</Tooltip>
					</PermissionsGate>
					<Tooltip title={'Formato tabla'} placement={'top'}>
						<Button
							variant={'text'}
							color={'primary'}
							onClick={() => {
								exportExcelTable(table.getRowModel().rows);
							}}
						>
							Exportar con formato a Excel
						</Button>
					</Tooltip>
				</Box>
			</Fragment>
		),
		localization: es,
	});
	return <MaterialReactTable table={table} />;
};

LeadsMaterialReactTable.propTypes = {};

export default LeadsMaterialReactTable;
