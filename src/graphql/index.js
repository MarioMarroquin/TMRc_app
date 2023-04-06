import { ApolloClient, InMemoryCache, ApolloLink } from '@apollo/client';
import authLink from './links/auth';
import httpLink from './links/http';

const link = ApolloLink.from([authLink, httpLink]);

const client = new ApolloClient({
	link,
	cache: new InMemoryCache({
		typePolicies: {
			Document: {
				fields: {
					versions: {
						merge: true,
					},
				},
			},
		},
	}),
	defaultOptions: {
		watchQuery: {
			fetchPolicy: 'cache-and-network',
			errorPolicy: 'all',
		},
		query: {
			fetchPolicy: 'cache-and-network',
			errorPolicy: 'all',
		},
		mutate: {
			errorPolicy: 'all',
		},
	},
});

export default client;
