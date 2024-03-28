import {
	Backdrop,
	Box,
	CircularProgress,
	LinearProgress,
	useTheme,
} from '@mui/material';
import { Rings } from 'react-loader-spinner';
import { useLoading } from '@providers/loading';
import { useLoaderContext } from '@providers/loader';

const ProgressLoader = ({ progress }) => {
	return <CircularProgress variant='determinate' value={progress} />;
};
export default ProgressLoader;
