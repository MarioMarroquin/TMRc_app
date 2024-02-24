import { alpha, createTheme, Paper } from '@mui/material';
import { esES } from '@mui/material/locale';
import { esES as esESX } from '@mui/x-data-grid';
import palette from '@config/theme/light/palette';
import { pxToRem } from '@config/theme/functions';
import normalFont from '@config/theme/light/normalFont';
import lightFont from '@config/theme/light/lightFont';
import boldfont from '@config/theme/light/boldfont';

const theme = createTheme(
	{
		shape: { borderRadius: 8 },
		typography: {
			fontSize: 14,
			fontFamily: 'Inter',
			...normalFont,
			...lightFont,
			...boldfont,
		},
		palette: {
			mode: 'light',
			...palette,
		},
		components: {
			MuiTextField: {
				defaultProps: { size: 'small' },
				styleOverrides: {
					root: {
						'& .MuiOutlinedInput-root': {
							'& fieldset': {
								borderColor: 'transparent',
							},
							'&:hover fieldset': {
								borderColor: 'transparent',
							},
							'&.Mui-focused fieldset': {
								borderColor: palette.primary.main,
							},
						},
						input: {
							'&::placeholder': {
								color: '#CDCDCD',
								opacity: 1,
							},
						},
					},
				},
			},
			MuiOutlinedInput: {
				styleOverrides: {
					root: {
						backgroundColor: '#F4F4F4',
					},
				},
			},
			MuiAutocomplete: {
				defaultProps: {
					PaperComponent: (props) => (
						<Paper
							sx={{
								borderRadius: `0 0 ${pxToRem(8)} ${pxToRem(8)}`,
								boxShadow: `0px 15px 16px rgba(3, 7, 18, 0.20),
														0px 60px 65px rgba(3, 7, 18, 0.10);
														`,
							}}
							{...props}
						/>
					),
				},
			},
			MuiButton: {
				defaultProps: { variant: 'contained', size: 'small' },
				styleOverrides: {
					root: {
						textTransform: 'none',
						fontSize: 14,
						fontWeight: 600,
						padding: `4px 12px`,
					},
				},
			},
			MuiSelect: {
				styleOverrides: {
					root: {
						fontSize: 14,
					},
				},
				defaultProps: {
					MenuProps: {
						sx: {
							'& .MuiPaper-root': {
								borderRadius: `0 0 ${pxToRem(8)} ${pxToRem(8)}`,
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

			MuiInputLabel: {
				styleOverrides: { root: { fontSize: 12 } },
			},
			//
			// MuiFilledInput: {
			// 	styleOverrides: {
			// 		root: {
			// 			borderRadius: `${pxToRem(12)} ${pxToRem(12)} 0 0}`,
			// 			backgroundColor: '#f9f9f9',
			// 			'&:hover': {
			// 				backgroundColor: '#f7faff',
			// 			},
			// 			'&.Mui-disabled': {
			// 				opacity: 0.4,
			// 				backgroundColor: '#fcfcfe',
			// 			},
			// 			'&.Mui-focused': {
			// 				backgroundColor: '#f9fcff',
			// 				'&:hover': {
			// 					backgroundColor: '#f7faff',
			// 				},
			// 			},
			// 		},
			// 	},
			// },
		},
	},
	esES,
	esESX
);

export default theme;
