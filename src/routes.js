import { Business, Person, SettingsPhone } from '@mui/icons-material';
import Requests from '@views/main/requests';
import RequestDetails from '@views/main/requests/RequestDetails';
import Companies from '@views/main/companies';
import ClientDetails from '@views/main/clients/ClientDetails';
import Clients from '@views/main/clients';

const routes = [
	// {
	// 	name: 'Inicio',
	// 	path: '/home',
	// 	icon: <HomeIcon />,
	// 	render: <></>,
	// },
	{
		name: 'Solicitudes',
		path: '/requests',
		icon: <SettingsPhone />,
		render: <Requests />,
		child: [{ path: ':id', render: <RequestDetails /> }],
	},
	{
		name: 'Compañías',
		path: '/companies',
		icon: <Business />,
		render: <Companies />,
	},

	{
		name: 'Clientes',
		path: '/clients',
		icon: <Person />,
		render: <Clients />,
		child: [{ path: ':id', render: <ClientDetails /> }],
	},
];

export { routes };
