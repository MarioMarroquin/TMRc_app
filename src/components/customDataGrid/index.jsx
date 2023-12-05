import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { Box, useTheme } from '@mui/material';
import { pxToRem } from '@config/theme/functions';

const selectedSecondaryColor = 'rgba(157,53,53,0.85)';

const CustomDataGrid = (props) => {
	const theme = useTheme();
	const primaryColor = theme.palette.primary.main;
	const hoverColor = theme.palette.secondary.hover;

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
						color: primaryColor,
					},
					'	.MuiDataGrid-menuIconButton': {
						color: primaryColor,
					},
					'&.MuiDataGrid-root': {
						border: 'none',
					},
					'.MuiDataGrid-footerContainer': {
						border: 'none',
					},
					'& .MuiDataGrid-row:hover': {
						borderRadius: pxToRem(12),
						backgroundColor: hoverColor,
					},
					'& .MuiDataGrid-row.Mui-selected': {
						borderRadius: pxToRem(12),
						backgroundColor: primaryColor,
						color: theme.palette.background.default,
						'&:hover': {
							backgroundColor: `${primaryColor}90`,
						},
					},
					'& .MuiDataGrid-row--editing': {
						boxShadow: 'none',
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
