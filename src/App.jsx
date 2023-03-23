import { Navigate, Route, Routes } from 'react-router-dom';
import Login from '@views/auth/login';
import AuthLayout from '@layouts/authLayout';


// const Requests = lazy(() => import('@views/requests'));

const App = () => {
	const isLogged = false;

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

	return 'lol';
};

export default App;
