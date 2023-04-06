import { setContext } from '@apollo/client/link/context';
import { accessToken } from '@utils/auth';

const authLink = setContext((_, { headers }) => {
	const token = accessToken.get();

	return {
		headers: {
			...headers,
			authorization: token ? `Bearer ${token}` : '',
		},
	};
});

export default authLink;
