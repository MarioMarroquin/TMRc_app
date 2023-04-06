import { Backdrop, useTheme } from '@mui/material';
import { Rings } from 'react-loader-spinner';
import { useLoading } from '@providers/loading';

const Loader = () => {
	const { loading } = useLoading();
	const theme = useTheme();

	return (
		<Backdrop sx={{ zIndex: 1500 }} open={loading}>
			<Rings height='150' width='150' color={theme.palette.primary.main} />
		</Backdrop>
	);
};
export default Loader;
