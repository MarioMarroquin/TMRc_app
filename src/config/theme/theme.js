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
			fontFamily: 'Inter',
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
						textTransform: 'none',
					},
				},
			},
			MuiTextField: {
				defaultProps: {
					size: 'small',
					color: 'secondary',
					margin: 'dense',
					fullWidth: true,
				},
			},
			MuiFormControl: {
				defaultProps: {
					size: 'small',
					color: 'secondary',
					margin: 'dense',
					fullWidth: true,
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
			MuiCardHeader: {
				styleOverrides: {
					root: {
						padding: `${pxToRem(12)} ${pxToRem(18)} !important`,
					},
				},
			},
			MuiCardContent: {
				styleOverrides: {
					root: {
						padding: `${pxToRem(12)} ${pxToRem(18)} ${pxToRem(0)}`,
						'&:last-child': { paddingBottom: pxToRem(12) },
					},
				},
			},
			MuiCardActions: {
				styleOverrides: {
					root: {
						padding: `${pxToRem(12)} ${pxToRem(18)} ${pxToRem(12)}`,
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
			MuiTab: {
				styleOverrides: {
					root: {
						// '&.Mui-selected': {
						// 	color: 'secondary',
						// },
						'&.Mui-selected': {
							color: colors.secondary.main,
							'&:hover': {
								color: colors.secondary.main,
							},
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
