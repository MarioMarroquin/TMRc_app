import { Business, Person, Settings, SettingsPhone } from '@mui/icons-material';
import { lazy } from 'react';

const Leads = lazy(() => import('./views/main/leads'));
const LeadDetail = lazy(() => import('./views/main/leads/subviews/leadDetail'));
const Maintenance = lazy(() => import('./views/main/maintenance'));
const Clients = lazy(() => import('./views/main/maintenance/clients'));

const mainRoutes = [
	{
		name: 'Solicitudes',
		path: '/requests',
		icon: <SettingsPhone />,
		element: <Leads />,
		index: true,
		children: [{ path: ':id', element: <LeadDetail /> }],
	},
	{
		name: 'Mantenimiento',
		path: '/maintenance',
		icon: <Settings />,
		element: <Maintenance />,
		index: false,
		children: [{ path: 'clients', element: <Clients /> }],
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
