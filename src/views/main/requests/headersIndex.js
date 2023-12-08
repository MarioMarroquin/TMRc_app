import { format } from 'date-fns';
import { ProductStatus, RequestStatus, ServiceType } from '@utils/enums';
import { Typography } from '@mui/material';
import formatToFolio from '@utils/functions/formatToFolio';
import {
	AssignmentTurnedIn,
	PlaylistAddCheckCircle,
	WatchLater,
} from '@mui/icons-material';

export const headers = [
	{
		field: 'requestStatusIcon',
		headerName: '',
		headerAlign: 'left',
		align: 'left',
		width: 10,
		disableColumnMenu: true,
		hideSortIcons: true,
		renderCell: (params) => {
			const value = params.row.requestStatus;
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
		field: 'shortId',
		headerName: 'FOLIO',
		headerAlign: 'left',
		align: 'left',
		width: 130,
		valueGetter: (params) => {
			const aux = formatToFolio(params.row.createdAt);
			return aux;
		},
	},

	{
		field: 'requestDate',
		headerName: 'FECHA',
		headerAlign: 'left',
		align: 'left',
		hide: true,
		width: 180,
		valueFormatter: (params) => {
			return format(new Date(params.value), 'dd/MM/yyyy - HH:mm');
		},
	},
	{
		field: 'serviceType',
		headerName: 'SERVICIO',
		headerAlign: 'left',
		align: 'center',
		minWidth: 120,
		valueGetter: (params) => {
			if (!params.value) {
				return '';
			} else {
				return ServiceType[params.value];
			}
		},
	},
	{
		field: 'assignedUser',
		headerName: 'ASESOR',
		headerAlign: 'left',
		align: 'left',
		minWidth: 150,
		flex: 0.5,
		valueGetter: (params) => {
			return `${params.value?.firstName || ''} ${params.value?.lastName || ''}`;
		},
	},
	{
		field: 'contactMedium',
		headerName: 'MEDIO DE CONTACTO',
		headerAlign: 'left',
		align: 'center',
		minWidth: 150,
	},
	{
		field: 'advertisingMedium',
		headerName: 'MEDIO DE PUBLICIDAD',
		headerAlign: 'left',
		align: 'center',
		minWidth: 150,
	},
	{
		field: 'brand',
		headerName: 'MARCA',
		headerAlign: 'left',
		align: 'left',
		width: 200,
		valueGetter: (params) => {
			return params.value?.name || '';
		},
	},

	{
		field: 'productStatus',
		headerName: 'ESTADO FÍSICO',
		headerAlign: 'left',
		align: 'center',
		flex: 1,
		minWidth: 200,
		valueGetter: (params) => {
			if (!params.value) {
				return '';
			} else {
				return ProductStatus[params.value];
			}
		},
	},
	{
		field: 'comments',
		headerName: 'COMENTARIOS',
		headerAlign: 'left',
		align: 'left',
		width: 200,
	},
	{
		field: 'company',
		headerName: 'EMPRESA',
		headerAlign: 'left',
		align: 'left',
		width: 200,
		valueGetter: (params) => {
			return params.value?.name || '';
		},
	},
	{
		field: 'client',
		headerName: 'CLIENTE',
		headerAlign: 'left',
		align: 'left',
		width: 200,
		valueGetter: (params) => {
			return `${params.value?.firstName || ''} ${params.value?.lastName || ''}`;
		},
	},

	{
		field: 'clientPhoneNumber',
		headerName: 'CLIENTE CELULAR',
		headerAlign: 'left',
		align: 'left',
		width: 200,
		valueGetter: (params) => {
			return `${params.value?.phoneNumber}`;
		},
	},
	{
		field: 'extraComments',
		headerName: 'COMENTARIOS EXTRA',
		headerAlign: 'left',
		align: 'left',
		width: 200,
	},

	{
		field: 'createdAt',
		headerName: 'CREADO EN',
		headerAlign: 'left',
		align: 'left',
		width: 200,
		valueFormatter: (params) => {
			return format(new Date(params?.value), 'dd/MM/yyyy - HH:mm');
		},
	},
	{
		field: 'updatedAt',
		headerName: 'ACTUALIZADO EN',
		headerAlign: 'left',
		align: 'left',
		width: 200,
		valueFormatter: (params) => {
			return format(new Date(params?.value), 'dd/MM/yyyy - HH:mm');
		},
	},
	{
		field: 'createdBy',
		headerName: 'CREADO POR',
		headerAlign: 'left',
		align: 'right',
		minWidth: 150,
		flex: 0.5,
		valueGetter: (params) => {
			return `${params.row.createdBy?.firstName || ''} ${
				params.row.createdBy?.lastName || ''
			}`;
		},
	},
	{
		field: 'requestStatus',
		headerName: 'ESTATUS',
		headerAlign: 'left',
		align: 'left',
		minWidth: 120,
		valueFormatter: (params) => {
			return RequestStatus[params.value];
		},
		renderCell: (params) => {
			if (!params.value) {
				return '';
			} else if (params.value === 'PENDING') {
				return (
					<Typography color={'error'}>{RequestStatus[params.value]}</Typography>
				);
			} else if (params.value === 'TRACING') {
				return (
					<Typography color={'info'}>{RequestStatus[params.value]}</Typography>
				);
			} else {
				return <Typography>{RequestStatus[params.value]}</Typography>;
			}
		},
	},
	{
		field: 'isSale',
		headerName: 'VENTA',
		headerAlign: 'left',
		align: 'left',
		width: 100,
		valueFormatter: (params) => {
			if (params?.value) {
				return 'SI';
			} else if (!params?.value) {
				return 'NO';
			} else {
				return '';
			}
		},
	},
	// {
	// 	field: 'updatedBy',
	// 	headerName: 'ACTUALIZADO POR',
	// 	headerAlign: 'left',
	// 	align: 'left',
	// 	width: 200,
	// 	valueGetter: (params) => {
	// 		console.log('INVALID', params);
	//
	// 		return `${params.row.firstName || ''} ${params.row.lastName || ''}`;
	// 	},
	// },
];
