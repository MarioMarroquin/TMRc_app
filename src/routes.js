import {
	AllInbox,
	Business,
	Event,
	Person,
	Settings,
	SettingsPhone,
} from '@mui/icons-material';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

import { lazy } from 'react';
import { Typography } from '@mui/material';
import Reminders from '@views/main/reminders';
import {
	SCOPES_BRANDS,
	SCOPES_CLIENTS,
	SCOPES_COMPANIES,
	SCOPES_GENERAL as Scopes_REQUEST,
	SCOPES_GENERAL,
	SCOPES_REMINDERS,
	SCOPES_REQUEST,
} from '@config/permisissions/permissions';

const Leads = lazy(() => import('./views/main/leads'));
const LeadDetail = lazy(() => import('./views/main/leads/subviews/leadDetail'));
const Maintenance = lazy(() => import('./views/main/maintenance'));
const Users = lazy(() => import('./views/main/maintenance/users'));
const Clients = lazy(() => import('./views/main/clients'));
const Companies = lazy(() => import('./views/main/companies'));
const Brand = lazy(() => import('./views/main/brand'));

const mainRoutes = [
	{
		children: [
			{
				path: ':id',
				element: <LeadDetail />,
				scopes: [SCOPES_GENERAL.total, SCOPES_REQUEST.total],
				active: true,
			},
		],
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
		active: false,
		scopes: [SCOPES_GENERAL.total, SCOPES_REMINDERS.total],
	},
	{
		element: <Companies />,
		icon: <Business />,
		index: true,
		name: 'Compañias',
		path: '/companies',
		active: false,
		scopes: [SCOPES_GENERAL.total, SCOPES_COMPANIES.total],
	},
	{
		element: <Brand />,
		icon: <LocalOfferIcon />,
		index: true,
		name: 'Marca',
		path: '/brand',
		active: false,
		scopes: [SCOPES_GENERAL.total, SCOPES_BRANDS.total],
	},
	{
		element: <Clients />,
		icon: <Person />,
		index: true,
		name: 'Clientes',
		path: '/clients',
		active: false,
		scopes: [SCOPES_GENERAL.total, SCOPES_CLIENTS.total],
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
				active: true,
				scopes: [SCOPES_GENERAL.total],
			},
		],
		mainIcon: <SettingsPhone />,
		mainPath: '/management',
		mainName: 'Administración',
		nested: true,
		active: true,
		scopes: [SCOPES_GENERAL.total],
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
	// 	children: [{ path: ':id', element: <ClientDetails /> }],z<s
	// },
];

export { mainRoutes };
