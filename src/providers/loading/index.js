import { useContext } from 'react';
import LoadingProvider, { LoadingContext } from './provider';

const useLoading = () => useContext(LoadingContext);

export { useLoading, LoadingProvider };
