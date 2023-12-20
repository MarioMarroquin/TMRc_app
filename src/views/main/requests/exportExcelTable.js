import ExcelJS from 'exceljs';
import { format } from 'date-fns';

const exportExcelTable = (rowModel) => {
	const wb = new ExcelJS.Workbook();
	const sh = wb.addWorksheet('Reporte');

	const rowModelColumns = rowModel[0]
		.getVisibleCells() // obtain columns using one row
		.filter((obj) => obj.column.id !== 'mrt-row-spacer') // remove display columns
		.map((obj) => {
			return {
				header: obj.column.columnDef.header,
				key: obj.column.id,
				width: obj.column.columnDef.size / 8,
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

	const rowModelRows = rowModel.map((row) => {
		const operatorCommentsValue = row.original.operatorComments
			.map((item) => {
				return `${format(new Date(item.createdAt), 'dd/MM/yyyy - HH:mm')} -> ${
					item.comment
				}`;
			})
			.join('\r\n');

		const managerCommentsValue = row.original.managerComments
			.map((item) => {
				return `${format(new Date(item.createdAt), 'dd/MM/yyyy - HH:mm')} -> ${
					item.comment
				}`;
			})
			.join('\r\n');

		const documentsValue = row.original.documents.length;

		const keyValuesAux = [
			{ key: 'operatorComments', value: operatorCommentsValue },
			{ key: 'managerComments', value: managerCommentsValue },
			{ key: 'documents', value: documentsValue },
		];

		return [
			...row
				.getVisibleCells()
				.filter((column) => column.column.id !== 'mrt-row-spacer') // remove display columns
				.map((column) => {
					return { key: column.column.id, value: column.getValue() };
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
