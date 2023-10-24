import { alpha, createTheme, Paper } from '@mui/material';
import { esES } from '@mui/material/locale';
import { esES as esESX } from '@mui/x-data-grid';
import palette from '@config/theme/light/palette';
import { pxToRem } from '@config/theme/functions';

const theme = createTheme(
	{
		typography: {
			fontFamily: 'Inter',
			primaryBold20: {
				fontSize: 20,
				fontWeight: 700,
				display: 'block',
			},
		},
		palette: {
			mode: 'light',
			...palette,
		},
		components: {
			MuiTextField: {
				defaultProps: { fullWidth: true, variant: 'filled', size: 'small' },
			},
			MuiAutocomplete: {
				defaultProps: {
					PaperComponent: (props) => (
						<Paper
							sx={{
								borderRadius: `0 0 ${pxToRem(12)} ${pxToRem(12)}`,
								boxShadow: `0px 15px 16px rgba(3, 7, 18, 0.20),
														0px 60px 65px rgba(3, 7, 18, 0.10);
														`,
							}}
							{...props}
						/>
					),
				},
			},
			MuiSelect: {
				styleOverrides: {
					filled: {
						borderRadius: `${pxToRem(12)} ${pxToRem(12)} 0 0}`,
					},
				},
				defaultProps: {
					MenuProps: {
						sx: {
							'& .MuiPaper-root': {
								borderRadius: `0 0 ${pxToRem(12)} ${pxToRem(12)}`,
								// marginTop: theme.spacing(1),
								color: 'rgb(55, 65, 81)',
								boxShadow: `0px 15px 16px rgba(3, 7, 18, 0.20),
														0px 60px 65px rgba(3, 7, 18, 0.10);
														`,
								'& .MuiMenu-list': {
									padding: '0 0',
								},
							},
						},
					},
				},
			},
			MuiFilledInput: {
				styleOverrides: {
					root: {
						borderRadius: `${pxToRem(12)} ${pxToRem(12)} 0 0}`,
						backgroundColor: '#f9f9f9',
						'&:hover': {
							backgroundColor: '#f7faff',
						},
						'&.Mui-disabled': {
							opacity: 0.4,
							backgroundColor: '#fcfcfe',
						},
						'&.Mui-focused': {
							backgroundColor: '#f9fcff',
							'&:hover': {
								backgroundColor: '#f7faff',
							},
						},
					},
				},
			},
			MuiFormControl: {
				defaultProps: { fullWidth: true, variant: 'filled', size: 'small' },
			},
			MuiInputLabel: {
				styleOverrides: { root: { fontSize: 12 } },
			},
		},
	},
	esES,
	esESX
);

export default theme;
