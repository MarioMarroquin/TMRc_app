import { format } from 'date-fns';
import {
	ProductStatus,
	RequestStatus,
	ServiceType,
} from '../../../utils/enums';

export const headers = [
	{
		field: 'requestDate',
		headerName: 'FECHA',
		headerAlign: 'left',
		align: 'left',
		width: 200,
		valueFormatter: (params) => {
			return format(new Date(params.value), 'dd/MM/yyyy - HH:mm');
		},
	},
	{
		field: 'service',
		headerName: 'SERVICIO',
		headerAlign: 'left',
		align: 'center',
		flex: 1,
		minWidth: 200,
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
		field: 'user',
		headerName: 'ASESOR',
		headerAlign: 'left',
		align: 'left',
		width: 200,
		valueGetter: (params) => {
			return `${params.row.firstName || ''} ${params.row.lastName || ''}`;
		},
	},
	{
		field: 'brand',
		headerName: 'MARCA',
		headerAlign: 'left',
		align: 'left',
		width: 200,
		valueGetter: (params) => {
			return params.row.name || '';
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
			return params.row.name || '';
		},
	},
	{
		field: 'client',
		headerName: 'CLIENTE',
		headerAlign: 'left',
		align: 'left',
		width: 200,
		valueGetter: (params) => {
			return `${params.row.firstName || ''} ${params.row.firstlastName || ''}`;
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
		field: 'status',
		headerName: 'ESTATUS',
		headerAlign: 'left',
		align: 'center',
		flex: 1,
		minWidth: 200,
		valueGetter: (params) => {
			if (!params.value) {
				return '';
			} else {
				return RequestStatus[params.value];
			}
		},
	},
	{
		field: 'sale',
		headerName: 'VENTA',
		headerAlign: 'left',
		align: 'left',
		width: 200,
		valueFormatter: (params) => {
			if (params.value) {
				return 'SI';
			} else if (!params.value) {
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
			return format(new Date(params.value), 'dd/MM/yyyy - HH:mm');
		},
	},
	{
		field: 'updatedAt',
		headerName: 'ACTUALIZADO EN',
		headerAlign: 'left',
		align: 'left',
		width: 200,
		valueFormatter: (params) => {
			return format(new Date(params.value), 'dd/MM/yyyy - HH:mm');
		},
	},
	{
		field: 'createdBy',
		headerName: 'CREADO POR',
		headerAlign: 'left',
		align: 'left',
		width: 200,
		valueGetter: (params) => {
			return `${params.row.firstName || ''} ${params.row.lastName || ''}`;
		},
	},
	{
		field: 'updatedBy',
		headerName: 'ACTUALIZADO POR',
		headerAlign: 'left',
		align: 'left',
		width: 200,
		valueGetter: (params) => {
			return `${params.row.firstName || ''} ${params.row.lastName || ''}`;
		},
	},
];
