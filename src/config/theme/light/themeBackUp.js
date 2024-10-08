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
		shape: { borderRadius: 16 },
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
				defaultProps: {
					fullWidth: true,
					margin: 'dense',
				},
				styleOverrides: {
					root: {
						'& .MuiInputBase-root': {
							minHeight: '48px',
						},
						'& label.Mui-focused': {
							color: palette.secondary.main,
						},
						'& .MuiOutlinedInput-root': {
							'& fieldset': {
								borderColor: 'transparent',
							},
							'&:hover fieldset': {
								borderColor: 'transparent',
							},
							'&.Mui-focused fieldset': {
								borderColor: palette.secondary.main,
							},
						},
						borderRadius: pxToRem(12),
						fieldset: {
							borderRadius: pxToRem(12),
						},
						input: {
							fontSize: 14,
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
						paddingTop: '0px !important',
						paddingBottom: '0px !important',
						paddingLeft: '8px !important',
						borderRadius: pxToRem(12),
						backgroundColor: '#F4F4F4',
						'&:hover': {
							backgroundColor: palette.secondary.hover,
						},
						'&.Mui-disabled': {
							opacity: 0.4,
							backgroundColor: '#fcfcfe',
						},
						'&.Mui-focused': {
							backgroundColor: palette.secondary.light,
						},
					},
				},
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
			MuiButton: {
				defaultProps: { variant: 'contained' },
				styleOverrides: {
					root: {
						borderRadius: pxToRem(12),
						height: pxToRem(48),
						textTransform: 'none',
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
			MuiFormControl: {
				defaultProps: { fullWidth: true, variant: 'outlined' },
				styleOverrides: {
					root: {
						'& .MuiInputBase-root': {
							minHeight: '48px',
						},
						'& label.Mui-focused': {
							color: palette.secondary.main,
						},
						'& .MuiOutlinedInput-root': {
							'& fieldset': {
								borderColor: 'transparent',
							},
							'&:hover fieldset': {
								borderColor: 'transparent',
							},
							'&.Mui-focused fieldset': {
								borderColor: palette.secondary.main,
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
