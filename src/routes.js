import {
	Analytics,
	Assessment,
	Business,
	Home as HomeIcon,
	Message,
	Person,
	SettingsPhone,
} from '@mui/icons-material';
import Home from '@views/main/home';
import Clients from '@views/main/clients';
import ClientDetails from '@views/main/clients/components/clientDetails';
import Calls from '@views/main/calls';
import Companies from '@views/main/companies';

const routes = [
	{
		name: 'Inicio',
		path: '/home',
		icon: <HomeIcon />,
		render: <Home />,
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
		name: 'Llamadas',
		path: '/calls',
		icon: <SettingsPhone />,
		render: <Calls />,
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
