import ExcelJS from 'exceljs';

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

	sh.columns = [...rowModelColumns];

	const rowModelRows = rowModel.map((row) => {
		return row
			.getVisibleCells()
			.filter((column) => column.column.id !== 'mrt-row-spacer') // remove display columns
			.map((column) => {
				return { key: column.column.id, value: column.getValue() };
			});
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
