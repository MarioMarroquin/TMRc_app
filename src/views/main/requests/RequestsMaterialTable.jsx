import React, { Fragment, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
	MaterialReactTable,
	useMaterialReactTable,
} from 'material-react-table';
import { MRT_Localization_ES as es } from 'material-react-table/locales/es';
import {
	AssignmentTurnedIn,
	PlaylistAddCheckCircle,
	WatchLater,
} from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import { ProductStatus, RequestStatus, ServiceType } from '@utils/enums';
import { format } from 'date-fns';
import { useRequests } from '@providers/requests';
import exportExcelReport from '@views/main/requests/exportExcelReport';
import PermissionsGate from '@components/PermissionsGate';
import { SCOPES_REQUEST } from '@config/permisissions/permissions';

const RequestsMaterialTable = ({ data, loading, goToRequest }) => {
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
	} = useRequests();

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
					if (!value) {
						return '';
					} else if (value === 'PENDING') {
						return <WatchLater color={'error'} />;
					} else if (value === 'TRACING') {
						return <PlaylistAddCheckCircle color={'info'} />;
					} else {
						return <AssignmentTurnedIn color={'success'} />;
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
				accessorKey: 'requestStatus',
				header: 'ESTATUS',
				size: 145,
				minSize: 140,
				maxSize: 155,
				Cell: ({ cell }) => {
					const value = cell.getValue();

					if (!value) {
						return '';
					} else if (value === 'PENDING') {
						return (
							<Typography color={'error'}>{RequestStatus[value]}</Typography>
						);
					} else if (value === 'TRACING') {
						return (
							<Typography color={'info'}>{RequestStatus[value]}</Typography>
						);
					} else {
						return <Typography>{RequestStatus[value]}</Typography>;
					}
				},
				muiTableBodyCellProps: {
					align: 'center',
				},
			},
			{
				accessorFn: (row) => new Date(row.requestDate),
				id: 'requestDate',
				header: 'FECHA - HORA',
				size: 175,
				minSize: 170,
				maxSize: 185,
				Cell: ({ cell }) => format(cell.getValue(), 'dd/MM/yyyy - HH:mm'),
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
				accessorKey: 'serviceType',
				header: 'SERVICIO',
				size: 150,
				minSize: 145,
				maxSize: 160,
				Cell: ({ cell }) => {
					const value = cell.getValue();

					if (!value) {
						return '';
					} else {
						return ServiceType[value];
					}
				},
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
				accessorKey: 'productStatus',
				header: 'ESTADO FISICO',
				size: 180,
				minSize: 175,
				maxSize: 185,
				Cell: ({ cell }) => {
					const value = cell.getValue();

					if (!value) {
						return '';
					} else {
						return ProductStatus[value];
					}
				},
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
				accessorFn: (row) => new Date(row.createdAt),
				id: 'createdAt',
				header: 'FECHA DE CREACION',
				size: 210,
				minSize: 210,
				maxSize: 210,
				Cell: ({ cell }) => format(cell.getValue(), 'dd/MM/yyyy - HH:mm'),
				muiTableBodyCellProps: {
					align: 'center',
				},
			},
			{
				accessorFn: (row) => new Date(row.updatedAt),
				id: 'updatedAt',
				header: 'ULT. ACTUALIZACION',
				size: 210,
				minSize: 210,
				maxSize: 210,
				Cell: ({ cell }) => format(cell.getValue(), 'dd/MM/yyyy - HH:mm'),
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
				accessorKey: 'isSale',
				header: 'VENTA',
				size: 130,
				minSize: 130,
				maxSize: 130,
				Cell: ({ cell }) => {
					const value = cell.getValue();

					if (value) {
						return 'SI';
					} else if (!value) {
						return 'NO';
					} else {
						return '';
					}
				},
				muiTableBodyCellProps: {
					align: 'center',
				},
			},
		],
		[]
	);

	const table = useMaterialReactTable({
		columns,
		data,
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
			showSkeletons: loading,
			columnOrder: columnOrderModel,
			columnSizing: columnSizeModel,
		},
		columnResizeMode: 'onEnd',
		onPaginationChange: setPaginationModel,
		onColumnOrderChange: setColumnOrderModel,
		onColumnSizingChange: setColumnSizeModel,
		onColumnVisibilityChange: setColumnVisibilityModel,
		muiTableBodyRowProps: ({ row }) => ({
			onDoubleClick: (event) => {
				goToRequest(row.original);
			},
			sx: {
				cursor: 'pointer',
			},
		}),
		muiTablePaperProps: {
			sx: {
				width: '100%',
				boxShadow: 'none',
				border: 'none',
			},
		},
		muiTableHeadCellProps: {
			sx: {
				fontSize: 11,
				fontWeight: 'bold',
				color: 'text.secondary',
				borderBottom: `1px solid rgb(240, 240, 240)`,
			},
		},
		muiTableBodyCellProps: {
			sx: {
				borderBottom: 'none',
				boxShadow: 'none',
			},
		},
		renderTopToolbarCustomActions: ({ table }) => (
			<Fragment>
				<PermissionsGate scopes={[SCOPES_REQUEST.export]}>
					<Button
						color={'secondary'}
						onClick={() => {
							exportExcelReport(data);
						}}
					>
						exportar a excel
					</Button>
				</PermissionsGate>
				<Box />
			</Fragment>
		),
		localization: es,
	});
	return <MaterialReactTable table={table} />;
};

RequestsMaterialTable.propTypes = {};

export default RequestsMaterialTable;
