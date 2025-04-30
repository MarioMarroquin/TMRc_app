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
import {
	SCOPES_GENERAL,
	SCOPES_REMINDERS,
	SCOPES_REQUEST,
} from '@config/permisissions/permissions';

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
		scopes: [SCOPES_GENERAL.total, SCOPES_REQUEST.total],
	},
	{
		// children: [{ path: ':id', element: <LeadDetail /> }],
		element: <Reminders />,
		icon: <Event />,
		index: true,
		name: 'Recordatorios',
		path: '/reminders',
		active: true,
		scopes: [SCOPES_GENERAL.total, SCOPES_REMINDERS.total],
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
				scopes: [SCOPES_GENERAL.total],
			},
		],
		mainIcon: <SettingsPhone />,
		mainPath: '/management',
		mainName: 'Administración',
		nested: true,
		active: true,
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
