import { Business, Person, Settings, SettingsPhone } from '@mui/icons-material';
import { lazy } from 'react';
import { Typography } from '@mui/material';

const Leads = lazy(() => import('./views/main/leads'));
const LeadDetail = lazy(() => import('./views/main/leads/subviews/leadDetail'));
const Maintenance = lazy(() => import('./views/main/maintenance'));
const Clients = lazy(() => import('./views/main/maintenance/clients'));

const mainRoutes = [
	{
		children: [{ path: ':id', element: <LeadDetail /> }],
		element: <Leads />,
		icon: <SettingsPhone />,
		index: true,
		name: 'Solicitudes',
		path: '/requests',
	},
	{
		routes: [
			{
				// children: [{ path: ':id', element: <LeadDetail /> }],
				element: <Typography>asd</Typography>,
				icon: <Person />,
				index: true,
				name: 'Usuarios',
				path: '/management/users',
			},
		],
		mainIcon: <SettingsPhone />,
		mainPath: '/management',
		mainName: 'Administración',
		nested: true,
	},
	// {
	// 	name: 'Mantenimiento',
	// 	path: '/maintenance',
	// 	icon: <Settings />,
	// 	element: <Maintenance />,
	// 	index: false,
	// 	children: [{ path: 'clients', element: <Clients /> }],
	// },
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
