import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { useTheme } from '@mui/material';

const selectedSecondaryColor = 'rgba(222,222,222,0.85)';

const CustomDataGrid = (props) => {
	const theme = useTheme();
	const iconColor = theme.palette.secondary.main;

	// Agregar custom toolbars

	return (
		<DataGrid
			{...props}
			autoHeight
			sx={{
				'.MuiDataGrid-columnHeaders': {
					borderBottom: 'none',
					backgroundColor: 'rgba(222,222,222,0.15)',
					borderBottomLeftRadius: 1,
					borderBottomRightRadius: 1,
				},
				'.MuiDataGrid-columnHeaderTitle': {
					fontWeight: 'bold',
				},
				'& .MuiDataGrid-cell': {
					borderBottom: 'none',
				},
				'.MuiDataGrid-sortIcon': {
					color: iconColor,
				},
				'	.MuiDataGrid-menuIconButton': {
					color: iconColor,
				},
				'&.MuiDataGrid-root': {
					border: 'none',
				},
				'.MuiDataGrid-footerContainer': {
					border: 'none',
				},
				'& .MuiDataGrid-row.Mui-selected': {
					background: selectedSecondaryColor,
					'&:hover': {
						backgroundColor: selectedSecondaryColor,
					},
				},
				[`& .${gridClasses.cell}:focus, & .${gridClasses.cell}:focus-within`]: {
					outline: 'none',
				},
				[`& .${gridClasses.columnHeader}:focus, & .${gridClasses.columnHeader}:focus-within`]:
					{
						outline: 'none',
					},
			}}
		/>
	);
};

export default CustomDataGrid;
