import { createContext, useState } from 'react';
import PropTypes from 'prop-types';
import { Toaster } from 'react-hot-toast';
import Loader from '@components/loader';

const LoadingContext = createContext({
	loading: false,
	setLoading: null,
});

const LoadingProvider = ({ children }) => {
	const [loading, setLoading] = useState(false);
	const value = { loading, setLoading };

	return (
		<LoadingContext.Provider value={value}>
			{/* <Toaster /> */}
			{/* <Loader /> */}
			{children}
		</LoadingContext.Provider>
	);
};

LoadingProvider.propTypes = {
	children: PropTypes.element.isRequired,
};

export { LoadingContext };
export default LoadingProvider;
