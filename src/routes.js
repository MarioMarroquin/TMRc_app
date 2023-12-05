import { Business, Person, SettingsPhone } from '@mui/icons-material';
import { lazy } from 'react';

const Requests = lazy(() => import('./views/main/requests'));
const RequestDetails = lazy(() =>
	import('./views/main/requests/RequestDetails')
);
const Companies = lazy(() => import('./views/main/companies'));
const Clients = lazy(() => import('./views/main/clients'));
const ClientDetails = lazy(() => import('./views/main/clients/ClientDetails'));

const mainRoutes = [
	{
		name: 'Solicitudes',
		path: '/requests',
		icon: <SettingsPhone />,
		element: <Requests />,
		children: [{ path: ':id', element: <RequestDetails /> }],
	},
	// {
	// 	name: 'Compañías',
	// 	path: '/companies',
	// 	icon: <Business />,
	// 	element: <Companies />,
	// },
	// {
	// 	name: 'Clientes',
	// 	path: '/clients',
	// 	icon: <Person />,
	// 	element: <Clients />,
	// 	children: [{ path: ':id', element: <ClientDetails /> }],
	// },
];

export { mainRoutes };
