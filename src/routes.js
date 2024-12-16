import {
	AllInbox,
	Business,
	Event,
	Person,
	Settings,
	SettingsPhone,
} from '@mui/icons-material';
import { lazy } from 'react';
import { Typography } from '@mui/material';
import Reminders from '@views/main/reminders';

const Leads = lazy(() => import('./views/main/leads'));
const LeadDetail = lazy(() => import('./views/main/leads/subviews/leadDetail'));
const Maintenance = lazy(() => import('./views/main/maintenance'));
const Users = lazy(() => import('./views/main/maintenance/users'));
const Clients = lazy(() => import('./views/main/maintenance/clients'));

const mainRoutes = [
	{
		children: [{ path: ':id', element: <LeadDetail /> }],
		element: <Leads />,
		icon: <AllInbox />,
		index: true,
		name: 'Solicitudes',
		path: '/leads',
		active: true,
	},
	{
		// children: [{ path: ':id', element: <LeadDetail /> }],
		element: <Reminders />,
		icon: <Event />,
		index: true,
		name: 'Recordatorios',
		path: '/reminders',
		active: false,
	},
	{
		routes: [
			{
				// children: [{ path: ':id', element: <LeadDetail /> }],
				element: <Users />,
				icon: <Person />,
				index: true,
				name: 'Usuarios',
				path: '/management/users',
				active: false,
			},
		],
		mainIcon: <SettingsPhone />,
		mainPath: '/management',
		mainName: 'Administración',
		nested: true,
		active: false,
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
