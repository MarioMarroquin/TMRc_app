import { gql } from '@apollo/client';

const CREATE_CLIENT = gql`
	mutation CreateClient($client: CreateClientInput!) {
		createClient(client: $client) {
			id
			firstName
			lastName
			phoneNumber
			createdAt
		}
	}
`;

export { CREATE_CLIENT };
