import { gql } from '@apollo/client';

const UPDATE_CLIENT = gql`
	mutation UpdateClient($clientId: ID!, $client: UpdateClientInput) {
		updateClient(clientId: $clientId, client: $client) {
			id
		}
	}
`;

export { UPDATE_CLIENT };
