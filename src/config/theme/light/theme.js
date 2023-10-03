import { createTheme } from '@mui/material';
import { esES } from '@mui/material/locale';
import { esES as esESX } from '@mui/x-data-grid';
import palette from '@config/theme/light/palette';

const theme = createTheme(
	{
		typography: {
			fontFamily: 'Inter',
			primaryBold20: {
				fontSize: 30,
				fontWeight: 500,
			},
		},
		palette: {
			mode: 'light',
			...palette,
		},
		components: {},
	},
	esES,
	esESX
);

export default theme;
