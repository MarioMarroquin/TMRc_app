import {
	Analytics,
	Assessment,
	Business,
	Home as HomeIcon,
	Person,
	SettingsPhone,
} from '@mui/icons-material';
import Home from '@views/main/home';
import Clients from '@views/main/clients';
import ClientDetails from '@views/main/clients/components/clientDetails';
import Companies from '@views/main/companies';
import Requests from '@views/main/requests';
import RequestDetails from './views/main/requests/components/requestDetails';

const routes = [
	{
		name: 'Inicio',
		path: '/home',
		icon: <HomeIcon />,
		render: <></>,
	},
	{
		name: 'Estadísticas',
		path: '/statistics',
		icon: <Analytics />,
		render: <h1>Estadísticas</h1>,
	},
	{
		name: 'Compañias',
		path: '/companies',
		icon: <Business />,
		render: <Companies />,
	},
	{
		name: 'Solicitudes',
		path: '/requests',
		icon: <SettingsPhone />,
		render: <Requests />,
		child: [{ path: ':id', render: <RequestDetails /> }],
	},
	{
		name: 'Reportes',
		path: '/reports',
		icon: <Assessment />,
		render: <h1>Reportes</h1>,
	},
	{
		name: 'Clientes',
		path: '/clients',
		icon: <Person />,
		render: <Clients />,
		child: [{ path: ':id', render: <ClientDetails /> }],
	},
];

export default routes;
