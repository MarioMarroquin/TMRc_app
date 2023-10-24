import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { Box, useTheme } from '@mui/material';
import { pxToRem } from '@config/theme/functions';

const selectedSecondaryColor = 'rgba(222,222,222,0.85)';

const CustomDataGrid = (props) => {
	const theme = useTheme();
	const iconColor = theme.palette.secondary.main;

	// Agregar custom toolbars

	return (
		<Box sx={{ width: '100%' }}>
			<DataGrid
				{...props}
				autoHeight
				pageSizeOptions={[5, 10, 15, 20]}
				sx={{
					'.MuiDataGrid-columnHeaders': {
						borderBottom: 'none',
					},
					'.MuiDataGrid-columnHeaderTitle': {
						fontWeight: 'bold',
						fontSize: pxToRem(11),
						color: 'text.secondary',
						paddingLeft: pxToRem(8),
						opacity: 0.7,
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
					'& .MuiDataGrid-row:hover': {
						borderRadius: 1,
					},
					'& .MuiDataGrid-row.Mui-selected': {
						background: selectedSecondaryColor,
						borderRadius: 1,
						'&:hover': {
							backgroundColor: selectedSecondaryColor,
						},
					},
					[`& .${gridClasses.cell}:focus, & .${gridClasses.cell}:focus-within`]:
						{
							outline: 'none',
						},
					[`& .${gridClasses.columnHeader}:focus, & .${gridClasses.columnHeader}:focus-within`]:
						{
							outline: 'none',
						},
				}}
			/>
		</Box>
	);
};

export default CustomDataGrid;
