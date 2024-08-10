import { createContext, useEffect, useState } from 'react';
import { accessToken, authClient } from '@utils/auth';
import { useApolloClient, useQuery } from '@apollo/client';
import toast from 'react-hot-toast';
import useInterval from '@hooks/use-interval';
import cookies from 'react-cookies';
import PropTypes from 'prop-types';
import { GET_USER_BY_TOKEN } from './requests';
import { useLoading } from '@providers/loading';
import { Avatar, Box, Typography } from '@mui/material';
import TMRLogo from '@utils/logo/TMR_logo.svg';
import useLiveTime from '@hooks/use-liveTime';

const SessionContext = createContext({});

const SessionProvider = ({ children }) => {
	const [token, setToken] = useState(accessToken.get());
	const [isLogged, setIsLogged] = useState(!!cookies.load('session'));
	// const { userId } = useMemo(() => (token ? jwt.decode(token) : {}), [token]);
	const [user, setUser] = useState();
	const [liveDate, setLiveDate] = useState(new Date());

	const apolloClient = useApolloClient();
	const { setLoading } = useLoading();
	const { data: dataUser } = useQuery(GET_USER_BY_TOKEN, {
		skip: !token,
	});

	const logoutWindow = async () => {
		setToken();
		setIsLogged(false);
		await apolloClient.clearStore();
		accessToken.set();
		toast.error('Se cerró la sesión');
		setLoading(false);
	};

	const logout = async () => {
		logoutWindow();
		await authClient.post('/logout');
		localStorage.setItem('logout', Date.now()); // Force logout on every tab
	};

	const getAccessToken = async () => {
		try {
			if (isLogged) {
				const { data } = await authClient.get('/access');
				accessToken.set(data.accessToken);
				setToken(data.accessToken);
				toast.success('Sesión cargada');
			}
		} catch (err) {
			logout();
		}
	};

	const saveLiveDate = (aux) => {
		setLiveDate(aux);
	};

	useLiveTime(saveLiveDate);

	useInterval(
		getAccessToken,
		1000 * 60 * 10, // 10 Minutes (5 mins less than access expiration)
		{
			skip: !isLogged,
			leading: true,
		}
	);

	const reloadSession = async () => {
		await getAccessToken();
	};

	useEffect(() => {
		// Listen when other tab logs out so every single tab returns to log in
		const logoutListener = async (event) => {
			if (event.key === 'logout') logoutWindow();
		};
		window.addEventListener('storage', logoutListener);
		return () => window.removeEventListener('storage', logoutListener);
	});

	useEffect(() => {
		if (isLogged) {
			setLoading(true);
		}
	}, [isLogged]);

	useEffect(() => {
		if (dataUser) {
			const aux = dataUser.userByToken;
			setUser(aux);
			setLoading(false);
		}
	}, [dataUser]);

	return (
		<SessionContext.Provider
			value={{
				isLogged,
				setIsLogged,
				logout,
				reloadSession,
				user,
				role: user?.role ?? '',
				liveDate,
			}}
		>
			{isLogged ? (
				user ? (
					children
				) : (
					<Box
						sx={{
							height: '100vh',
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							py: 40,
							px: 10,
						}}
					>
						<img src={TMRLogo} alt={'TMR Logo'} />
					</Box>
				)
			) : (
				children
			)}
		</SessionContext.Provider>
	);
};

SessionProvider.propTypes = {
	children: PropTypes.element,
};

export { SessionContext };
export default SessionProvider;
