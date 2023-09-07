import { format } from 'date-fns';
import { ProductStatus, RequestStatus, ServiceType } from '@utils/enums';
import { Typography } from '@mui/material';

export const headers = [
	{
		field: 'requestStatus',
		headerName: 'ESTATUS',
		headerAlign: 'left',
		align: 'left',
		minWidth: 120,
		renderCell: (params) => {
			if (!params.value) {
				return '';
			} else if (params.value === 'PENDING') {
				return (
					<Typography color={'error'}>{RequestStatus[params.value]}</Typography>
				);
			} else {
				return RequestStatus[params.value];
			}
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
		field: 'userFor',
		headerName: 'ASESOR',
		headerAlign: 'left',
		align: 'left',
		width: 200,
		valueGetter: (params) => {
			return `${params.value?.firstName || ''} ${params.value?.lastName || ''}`;
		},
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
		field: 'extraComments',
		headerName: 'COMENTARIOS EXTRA',
		headerAlign: 'left',
		align: 'left',
		width: 200,
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
	// {
	// 	field: 'createdBy',
	// 	headerName: 'CREADO POR',
	// 	headerAlign: 'left',
	// 	align: 'left',
	// 	width: 200,
	// 	valueGetter: (params) => {
	// 		console.log('INVALID', params);
	//
	// 		return `${params.row.firstName || ''} ${params.row.lastName || ''}`;
	// 	},
	// },
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
