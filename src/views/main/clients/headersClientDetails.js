import { format } from 'date-fns';
import { RequestStatus } from '@utils/enums';

export const headers = [
	{
		field: 'requestDate',
		headerName: 'FECHA',
		headerAlign: 'left',
		align: 'left',
		hide: true,
		width: 200,
		valueFormatter: (params) => {
			return format(new Date(params.value), 'dd/MM/yyyy - HH:mm');
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
];
