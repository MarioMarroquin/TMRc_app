import {
	Analytics,
	Assessment,
	Home as HomeIcon,
	Message,
	Person,
	SettingsPhone,
} from '@mui/icons-material';
import Home from '@views/main/home';
import Clients from '@views/main/clients';

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
		name: 'Mensajes',
		path: '/messages',
		icon: <Message />,
		render: <h1>Mensajes</h1>,
	},
	{
		name: 'Llamadas',
		path: '/calls',
		icon: <SettingsPhone />,
		render: <h1>Llamadas</h1>,
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
	},
];

export default routes;
