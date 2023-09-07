import { useContext } from 'react';
import RequestsProvider, { RequestsContext } from './provider';

const useRequests = () => useContext(RequestsContext);

export { useRequests, RequestsProvider };
