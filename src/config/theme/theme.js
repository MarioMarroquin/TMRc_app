import { createTheme } from '@mui/material';
import { esES } from '@mui/material/locale';
import { esES as esESX } from '@mui/x-data-grid';
import colors from './base/colors';

const theme = createTheme(
	{
		shape: { borderRadius: 8 },
		typography: {
			fontFamily: 'Montserrat',
		},
		palette: {
			mode: 'light',
			primary: colors.primary,
			secondary: colors.secondary,
			background: colors.background,
			text: colors.text,
		},
		components: {
			MuiButton: {
				defaultProps: {
					variant: 'contained',
					color: 'secondary',
				},
				styleOverrides: {
					root: {
						height: 40,
					},
				},
			},
			MuiTextField: {
				defaultProps: {
					size: 'small',
					color: 'secondary',
				},
			},

			MuiListItemButton: {
				styleOverrides: {
					root: {
						'&.Mui-selected': {
							backgroundColor: colors.background.default,
						},
					},
				},
			},
		},
	},
	esES,
	esESX
);

export default theme;
