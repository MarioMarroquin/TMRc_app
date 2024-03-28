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
		shape: { borderRadius: 1 },
		spacing: 1, // margin and padding, number transformation to px (value * 1)
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
				defaultProps: { fullWidth: true, size: 'small' },
				styleOverrides: {
					root: {
						borderRadius: 8,
						'& .MuiOutlinedInput-root': {
							'& fieldset': {
								borderColor: `${palette.primary.main}10`,
								borderStyle: 'groove',
							},
							'&:hover fieldset': {
								borderColor: `${palette.primary.main}30`,
								borderStyle: 'groove',
							},
							'&.Mui-focused fieldset': {
								borderColor: palette.primary.main,
								borderStyle: 'groove',
							},
						},
						'& .MuiInputBase-root.Mui-disabled fieldset': {
							borderColor: `${palette.primary.main}30`,
							borderStyle: 'dashed',
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
						borderRadius: 8,
						border: 'none',
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
				defaultProps: {
					variant: 'contained',
					size: 'small',
					disableElevation: true,
				},
				styleOverrides: {
					root: {
						textTransform: 'none',
						fontSize: 14,
						fontWeight: 600,
						padding: `4px 12px`,
						borderRadius: 8,
					},
				},
			},
			MuiSelect: {
				defaultProps: {
					MenuProps: {
						sx: {
							'& .MuiPaper-root': {
								borderRadius: 8,
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
			MuiDialog: {
				defaultProps: {
					slotProps: {
						backdrop: {
							sx: {
								backgroundColor: `${palette.background.default}85`,
								backdropFilter: 'blur(8px)',
							},
						},
					},
				},
				styleOverrides: {
					paper: { borderRadius: 8 },
				},
			},
			MuiCard: {
				styleOverrides: { root: { borderRadius: 8 } },
			},
			MuiFormControl: {
				defaultProps: { fullWidth: true, size: 'small' },
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
					},
				},
			},
		},
	},
	esES,
	esESX
);

export default theme;
