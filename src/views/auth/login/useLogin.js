import { authClient } from '@utils/auth';
import toast from 'react-hot-toast';
import { useSession } from '@providers/session';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useLoaderContext } from '@providers/loader';

const InitialCredential = {
	username: '',
	password: '',
	expires: false,
};

const useLogin = () => {
	const { loading, loadingOff, loadingOn } = useLoaderContext();
	const session = useSession();
	const navigate = useNavigate();
	const [hidePassword, setHidePassword] = useState(true);
	const toggleHide = () => setHidePassword((hide) => !hide);

	const [credential, setCredential] = useState(InitialCredential);

	const credentialInputChange = (e) => {
		const { name, value } = e.target;
		setCredential({ ...credential, [name]: value });
	};

	const login = async (e) => {
		e.preventDefault();
		loadingOn();

		await new Promise((resolve) => setTimeout(resolve, 2000));

		try {
			await authClient.post('/login', credential).then((res) => {
				session.setIsLogged(true);
				navigate('/requests');
				loadingOff();
			});
		} catch (err) {
			toast.error('Revisa tu correo y/o la contraseña');
			loadingOff();
		}
	};
	return {
		credential,
		credentialInputChange,
		hidePassword,
		loading,
		login,
		toggleHide,
	};
};

export default useLogin;
