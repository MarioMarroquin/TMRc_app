import { createTheme } from '@mui/material';
import { esES } from '@mui/material/locale';
import { esES as esESX } from '@mui/x-data-grid';

import createTypography from '@mui/material/styles/createTypography';
import createPalette from '@mui/material/styles/createPalette';

const secondaryColorMainOLD = '#23272b'; // black
const secondaryColorMain = '#393d3f'; // black

const theme = createTheme(
	{
		shape: { borderRadius: 8 },
		typography: {
			fontFamily: 'Montserrat',
		},
		palette: {
			mode: 'light',
			primary: {
				main: '#fdfdff',
			},
			secondary: {
				main: secondaryColorMain,
			},
			background: {
				default: '#f2f3f4',
			},
			text: {
				primary: '#33345d',
				secondary: '#8999ab',
			},
		},
		components: {
			MuiButton: {
				defaultProps: {
					variant: 'contained',
					color: 'secondary',
				},
				styleOverrides: {
					root: {
						height: 42,
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
							backgroundColor: '#f2f3f4',
						},
					},
				},
			},
			// MuiOutlinedInput: {
			// 	styleOverrides: {
			// 		root: {
			// 			'& fieldset.MuiOutlinedInput-notchedOutline': {
			// 				borderColor: '#DCE0E4',
			// 			},
			// 			'&:hover fieldset.MuiOutlinedInput-notchedOutline': {
			// 				borderColor: yellowPrimary,
			// 			},
			// 			borderRadius: 10,
			// 		},
			// 	},
			// },
		},
	},
	esES,
	esESX
);

export default theme;
