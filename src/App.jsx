import { Navigate, Route, Routes } from 'react-router-dom';
import Login from '@views/auth/login';
import AuthLayout from '@layouts/authLayout';
import { useSession } from '@providers/session';
import MainLayout from '@layouts/mainLayout';
import Home from '@views/main/home';
import Clients from '@views/main/clients';

// const Requests = lazy(() => import('@views/requests'));

const App = () => {
	const { isLogged } = useSession();

	if (!isLogged) {
		return (
			<Routes>
				<Route element={<AuthLayout />}>
					<Route path='login' element={<Login />} />
					<Route path='*' element={<Navigate replace to={'login'} />} />
				</Route>
			</Routes>
		);
	}

	return (
		<Routes>
			<Route element={<MainLayout />}>
				<Route path={'home'} element={<Home />} />
				<Route path={'statistics'} element={<h1>Estadísticas</h1>} />
				<Route path={'messages'} element={<h1>Mensajes</h1>} />
				<Route path={'reports'} element={<h1>Reportes</h1>} />
				<Route path={'clients'} element={<Clients />} />
				<Route path='*' element={<Navigate replace to={'home'} />} />
			</Route>
		</Routes>
	);
};

export default App;
