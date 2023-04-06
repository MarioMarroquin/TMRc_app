import {
	Analytics,
	Assessment,
	Home,
	Message,
	Person,
	SettingsPhone,
} from '@mui/icons-material';

const routes = [
	{
		name: 'Inicio',
		path: '/home',
		icon: <Home />,
	},
	{
		name: 'Estadísticas',
		path: '/statistics',
		icon: <Analytics />,
	},
	{
		name: 'Mensajes',
		path: '/messages',
		icon: <Message />,
	},
	{
		name: 'Llamadas',
		path: '/calls',
		icon: <SettingsPhone />,
	},
	{
		name: 'Reportes',
		path: '/reports',
		icon: <Assessment />,
	},
	{
		name: 'Clientes',
		path: '/clients',
		icon: <Person />,
	},
];

export default routes;
