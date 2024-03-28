import { Backdrop, Box, LinearProgress, useTheme } from '@mui/material';
import { Rings } from 'react-loader-spinner';
import { useLoading } from '@providers/loading';
import { useLoaderContext } from '@providers/loader';

const Loader = () => {
	const { loading } = useLoaderContext();

	// Transparent backdrop, prevent clicks
	return (
		<Backdrop
			sx={{ zIndex: 1500, backgroundColor: 'transparent' }}
			open={Boolean(loading)}
		>
			<Box sx={{ width: '100%', height: '100%' }}>
				<LinearProgress sx={{ width: '100%' }} />
			</Box>
		</Backdrop>
	);
};
export default Loader;
