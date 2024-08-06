import React, { Fragment, useEffect, useMemo, useRef } from 'react';
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
import { Box, Button, Tooltip, Typography } from '@mui/material';
import { ProductStatus, RequestStatusList, ServiceType } from '@utils/enums';
import { format } from 'date-fns';
import exportExcelReport from '@views/main/requests/exportExcelReport';
import PermissionsGate from '@components/PermissionsGate';
import { SCOPES_REQUEST } from '@config/permisissions/permissions';
import exportExcelTable from '@views/main/requests/exportExcelTable';
import { useLeadsMRTContext } from '@providers/local/LeadsMRT/provider';

const checkStatus = (status, isSale) => {
	const auxStatus =
		status === 'FINISHED' && !isSale
			? 'SIN CONCRETAR'
			: RequestStatusList[status].format;

	return auxStatus;
};

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
				accessorFn: (row) => row.requestStatus,
				id: 'requestStatusIcon',
				header: '',
				size: 65,
				enableResizing: false,
				enableColumnOrdering: false,
				Cell: ({ cell }) => {
					const value = cell.getValue();
					const isSale = cell.row.original.isSale;
					if (!value) {
						return '';
					} else if (value === 'PENDING') {
						return <WatchLater color={'error'} />;
					} else if (value === 'TRACING') {
						return <ContentPasteSearch color={'warning'} />;
					} else if (value === 'QUOTED') {
						return <RequestQuote color={'info'} />;
					} else {
						return (
							<AssignmentTurnedIn
								sx={{ color: isSale ? '#2e7d32' : '#F8A424' }}
							/>
						);
					}
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
				accessorFn: (row) => checkStatus(row.requestStatus, row?.isSale),
				id: 'requestStatus',
				header: 'ESTATUS',
				size: 145,
				minSize: 140,
				maxSize: 155,
				Cell: ({ cell }) => {
					const value = cell.getValue();

					if (!value) {
						return '';
					} else {
						return <Typography>{value}</Typography>;
					}
				},
				muiTableBodyCellProps: {
					align: 'center',
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
				size: 160,
				minSize: 135,
				maxSize: 185,
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

	useEffect(() => {
		try {
			rowVirtualizerInstanceRef.current?.scrollToIndex?.(0);
		} catch (error) {
			console.error(error);
		}
	}, []);

	const table = useMaterialReactTable({
		columns,
		data,
		rowVirtualizerInstanceRef,
		rowVirtualizerOptions: { overscan: 5 }, //optionally customize the row virtualizer
		columnVirtualizerOptions: { overscan: 2 }, //optionally customize the column virtualizer
		enableRowVirtualization: true,
		enableRowNumbers: true,
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
		muiTableContainerProps: { sx: { maxHeight: '500px' } },
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
