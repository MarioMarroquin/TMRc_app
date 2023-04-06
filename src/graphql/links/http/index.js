import { createHttpLink } from '@apollo/client';
import { apiUrl } from '@config/environment';

const httpLink = createHttpLink({
	uri: apiUrl,
	credentials: 'include',
});

export default httpLink;
