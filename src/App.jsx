import { Navigate, Route, Routes } from 'react-router-dom';
import Login from '@views/auth/login';
import AuthLayout from '@layouts/authLayout';
import { useSession } from '@providers/session';
import MainLayout from '@layouts/mainLayout';
import { mainRoutes } from './routes';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css';
import { Suspense } from 'react';
import { Box } from '@mui/material';
import TMRLogo from '@utils/logo/TMR_logo.svg'; // theme css file

const routeGenerator = (route) => {
	const { children, path, element } = route;

	if (children) {
		return (
			<Route key={path} path={path}>
				<Route index element={element} />
				{children.map((child) => routeGenerator(child))}
			</Route>
		);
	} else {
		return <Route key={path} path={path} element={element} />;
	}
};

const App = () => {
	const { isLogged, role } = useSession();

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
		<Suspense
			fallback={
				<Box
					sx={{
						height: '100vh',
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						py: 40,
						px: 10,
						opacity: 0.5,
					}}
				>
					<img src={TMRLogo} alt={'TMR Logo'} />
				</Box>
			}
		>
			<Routes>
				<Route element={<MainLayout />}>
					{mainRoutes.map((route) => routeGenerator(route))}
					<Route path='*' element={<Navigate replace to={'requests'} />} />
				</Route>
			</Routes>
		</Suspense>
	);
};

export default App;
