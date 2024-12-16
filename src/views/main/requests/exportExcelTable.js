import ExcelJS from 'exceljs';
import { format } from 'date-fns';

const exportExcelTable = (columnDefs, leadNodesToExport, apiRef) => {
	const wb = new ExcelJS.Workbook();
	const sh = wb.addWorksheet('Reporte');

	const rowModelColumns = columnDefs.map((column) => {
		return {
			header: column.headerName,
			key: column.colId,
			width: column.width / 8,
		};
	});

	const extraColumns = [
		{
			header: 'MI SEGUIMIENTO',
			key: 'operatorComments',
			width: 35,
		},
		{
			header: 'SEGUIMIENTO GERENTE',
			key: 'managerComments',
			width: 35,
		},
		{
			header: 'DOCUMENTOS',
			key: 'documents',
			width: 15,
		},
	];

	sh.columns = [...rowModelColumns, ...extraColumns];

	const rowModelRows = leadNodesToExport.map((node) => {
		const operatorCommentsValue = node.data.operatorComments
			.map((item) => {
				return `${format(new Date(item.createdAt), 'dd/MM/yyyy - HH:mm')} -> ${
					item.comment
				}`;
			})
			.join('\r\n');

		const managerCommentsValue = node.data.managerComments
			.map((item) => {
				return `${format(new Date(item.createdAt), 'dd/MM/yyyy - HH:mm')} -> ${
					item.comment
				}`;
			})
			.join('\r\n');

		const documentsValue = node.data.documents.length;

		const keyValuesAux = [
			{ key: 'operatorComments', value: operatorCommentsValue },
			{ key: 'managerComments', value: managerCommentsValue },
			{ key: 'documents', value: documentsValue },
		];

		return [
			...columnDefs.map((column) => {
				return {
					key: column.colId,
					value: apiRef.current.api.getValue(column.colId, node),
				};
			}),
			...keyValuesAux, // aqui va keyValuesAux
		];
	});

	rowModelRows.forEach((row) => {
		const columnObject = {};

		row.forEach((column) => {
			columnObject[column.key] = column.value;
		});

		sh.addRow(columnObject);
	});

	wb.xlsx.writeBuffer().then((res) => {
		const blob = new Blob([res], {
			type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
		});

		const url = window.URL.createObjectURL(blob);
		const anchor = document.createElement('a');
		anchor.href = url;
		anchor.download = 'ReporteTabla.xlsx';
		anchor.click();
		window.URL.revokeObjectURL(url);
	});
};

export default exportExcelTable;
