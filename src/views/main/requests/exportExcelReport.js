import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ProductStatus, RequestStatus, ServiceType } from '@utils/enums';

const ExcelJS = require('exceljs');

const exportExcelReport = (data) => {
	const auxData = [...data];

	const wb = new ExcelJS.Workbook();
	const sh = wb.addWorksheet('Reporte');

	sh.columns = [
		{ header: 'FECHA', key: 'requestDate', width: 10 },
		{ header: 'SERVICIO', key: 'serviceType', width: 15 },
		{ header: 'ASESOR', key: 'assignedUser', width: 20 },
		{ header: 'MEDIO DE CONTACTO', key: 'contactMedium', width: 20 },
		{ header: 'MEDIO DE PUBLICIDAD', key: 'advertisingMedium', width: 25 },
		{ header: 'MARCA', key: 'brand', width: 15 },
		{ header: 'ESTADO FISICO', key: 'productStatus', width: 15 },
		{ header: 'COMENTARIOS', key: 'comments', width: 35 },
		{ header: 'EMAIL', key: 'email', width: 25 },
		{ header: 'EMPRESA', key: 'company', width: 20 },
		{ header: 'NOMBRE CLIENTE', key: 'clientFirstName', width: 20 },
		{ header: 'APELLIDO CLIENTE', key: 'clientLastName', width: 20 },
		{ header: 'CELULAR', key: 'clientPhoneNumber', width: 15 },
		{ header: 'TELEFONO', key: 'companyPhoneNumber', width: 15 },
		{ header: 'COMENTARIOS EXTRA', key: 'extraComments', width: 40 },
		{ header: 'ESTATUS', key: 'requestStatus', width: 15 },
		{ header: 'VENTA', key: 'isSale', width: 10 },
	];

	auxData.sort(function (a, b) {
		if (a.assignedUser.firstName < b.assignedUser.firstName) {
			return -1;
		}
		if (a.assignedUser.firstName > b.assignedUser.firstName) {
			return 1;
		}
		return 0;
	});

	auxData.forEach((obj, index) => {
		sh.addRow({
			requestDate: format(new Date(obj.requestDate), 'dd-MMM-yy', {
				locale: es,
			}),
			serviceType: ServiceType[obj.serviceType],
			assignedUser: `${obj.assignedUser?.firstName} ${obj.assignedUser?.lastName}`,
			contactMedium: obj?.contactMedium,
			advertisingMedium: obj?.advertisingMedium,
			brand: obj.brand?.name,
			productStatus: ProductStatus[obj.productStatus],
			comments: obj?.comments,
			email: obj.client?.email ?? obj.company?.email,
			company: obj.company?.name,
			clientFirstName: obj.client?.firstName?.toLowerCase(),
			clientLastName: obj.client?.lastName?.toLowerCase(),
			clientPhoneNumber: obj.client?.phoneNumber,
			companyPhoneNumber: obj.company?.phoneNumber,
			extraComments: obj?.extraComments,
			requestStatus: RequestStatus[obj.requestStatus],
			isSale: obj.isSale ? 'SI' : 'NO',
		});
	});

	wb.xlsx.writeBuffer().then((res) => {
		const blob = new Blob([res], {
			type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
		});

		const url = window.URL.createObjectURL(blob);
		const anchor = document.createElement('a');
		anchor.href = url;
		anchor.download = 'ReporteClasico.xlsx';
		anchor.click();
		window.URL.revokeObjectURL(url);
	});
};

export default exportExcelReport;
