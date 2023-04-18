import { createTheme } from '@mui/material';
import { esES } from '@mui/material/locale';
import { esES as esESX } from '@mui/x-data-grid';
import colors from './base/colors';
import shadows from '@config/theme/base/shadows';
import { pxToRem } from '@config/theme/functions';
import DraggablePaper from '@components/draggablePaper';

const { xxl } = shadows;

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
			MuiCard: {
				defaultProps: {
					elevation: 0,
				},
				styleOverrides: {
					root: {
						boxShadow: xxl,
					},
				},
			},
			MuiCardContent: {
				styleOverrides: {
					root: {
						padding: `${pxToRem(8)} ${pxToRem(24)} `,
					},
				},
			},
			MuiDialog: {
				defaultProps: {
					fullWidth: true,
					PaperComponent: DraggablePaper,
					'aria-labelledby': 'dialogTitleDrag',
				},
			},
			MuiDialogTitle: {
				styleOverrides: {
					root: {
						cursor: 'move',
					},
				},
			},
		},
	},
	esES,
	esESX
);

export default theme;
