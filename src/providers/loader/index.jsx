import PropTypes from 'prop-types';
import { createContext, useContext, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Loader from '@components/loader';

const LoaderContext = createContext({
	fullScreen: true,
	loading: 0,
	loadingOn: () => {},
	loadingOff: () => {},
	setLoading: null,
});

const LoaderProvider = ({ children }) => {
	const [loading, setLoading] = useState(0);

	const loadingOn = () => {
		setLoading((prevState) => prevState + 1);
	};

	const loadingOff = () => {
		console.log('prevState: ', loading);
		setLoading((prevState) => {
			if (prevState !== 0) return prevState - 1;
		});
	};

	const value = { loading, setLoading, loadingOn, loadingOff };

	return (
		<LoaderContext.Provider value={value}>
			<Toaster />
			<Loader />
			{children}
		</LoaderContext.Provider>
	);
};

LoaderProvider.propTypes = {
	children: PropTypes.element.isRequired,
};

function useLoaderContext() {
	return useContext(LoaderContext);
}

export { LoaderContext, LoaderProvider, useLoaderContext };
