import { Navigate, Route, Routes } from 'react-router-dom';
import Login from '@views/auth/login';
import AuthLayout from '@layouts/authLayout';
import { useSession } from '@providers/session';
import MainLayout from '@layouts/mainLayout';
import { routes } from './routes';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file

// const Requests = lazy(() => import('@views/requests'));

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
		<Routes>
			<Route element={<MainLayout />}>
				{routes.map(({ path, render, child }) => {
					if (child) {
						return (
							<Route key={path} path={path}>
								<Route exact index element={render} />
								{child.map((item) => {
									return (
										<Route
											key={item.path}
											path={item.path}
											element={item.render}
										/>
									);
								})}
							</Route>
						);
					} else {
						return <Route key={path} path={path} element={render} />;
					}
				})}
				<Route path='*' element={<Navigate replace to={'requests'} />} />
			</Route>
		</Routes>
	);
};

export default App;
