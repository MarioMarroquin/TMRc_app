import {
	Analytics,
	Assessment,
	Business,
	Home as HomeIcon,
	Person,
	SettingsPhone,
} from '@mui/icons-material';
import AdminClients from '@views/main/admin/clients';
import AdminClientDetails from '@views/main/admin/clients/components/clientDetails';
import AdminCompanies from '@views/main/admin/companies';
import AdminRequests from '@views/main/admin/requests';
import AdminRequestDetails from '@views/main/admin/requests/components/requestDetails';

import SalesHome from '@views/main/sales/home';
import SalesClients from '@views/main/sales/clients';
import SalesClientDetails from '@views/main/sales/clients/components/clientDetails';
import SalesCompanies from '@views/main/sales/companies';
import SalesRequests from '@views/main/sales/requests';
import SalesRequestDetails from '@views/main/sales/requests/components/requestDetails';

import DeskHome from '@views/main/desk/home';
import DeskClients from '@views/main/desk/clients';
import DeskClientDetails from '@views/main/desk/clients/components/clientDetails';
import DeskCompanies from '@views/main/desk/companies';
import DeskRequests from '@views/main/desk/requests';
import DeskRequestDetails from '@views/main/desk/requests/components/requestDetails';

const adminRoutes = [
	{
		name: 'Inicio',
		path: '/home',
		icon: <HomeIcon />,
		render: <></>,
	},
	{
		name: 'Solicitudes',
		path: '/requests',
		icon: <SettingsPhone />,
		render: <AdminRequests />,
		child: [{ path: ':id', render: <AdminRequestDetails /> }],
	},
	{
		name: 'Compañias',
		path: '/companies',
		icon: <Business />,
		render: <AdminCompanies />,
	},

	{
		name: 'Clientes',
		path: '/clients',
		icon: <Person />,
		render: <AdminClients />,
		child: [{ path: ':id', render: <AdminClientDetails /> }],
	},
];

const salesRoutes = [
	{
		name: 'Inicio',
		path: '/home',
		icon: <HomeIcon />,
		render: <SalesHome />,
	},
	{
		name: 'Solicitudes',
		path: '/requests',
		icon: <SettingsPhone />,
		render: <SalesRequests />,
		child: [{ path: ':id', render: <SalesRequestDetails /> }],
	},
	{
		name: 'Compañias',
		path: '/companies',
		icon: <Business />,
		render: <SalesCompanies />,
	},

	{
		name: 'Clientes',
		path: '/clients',
		icon: <Person />,
		render: <SalesClients />,
		child: [{ path: ':id', render: <SalesClientDetails /> }],
	},
];

const deskRoutes = [
	{
		name: 'Inicio',
		path: '/home',
		icon: <HomeIcon />,
		render: <DeskHome />,
	},

	{
		name: 'Solicitudes',
		path: '/requests',
		icon: <SettingsPhone />,
		render: <DeskRequests />,
		child: [{ path: ':id', render: <DeskRequestDetails /> }],
	},
	{
		name: 'Compañias',
		path: '/companies',
		icon: <Business />,
		render: <DeskCompanies />,
	},
	{
		name: 'Clientes',
		path: '/clients',
		icon: <Person />,
		render: <DeskClients />,
		child: [{ path: ':id', render: <DeskClientDetails /> }],
	},
];

export { adminRoutes, salesRoutes, deskRoutes };
