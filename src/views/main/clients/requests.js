import { gql } from '@apollo/client';

const GET_CLIENTS = gql`
	query GetClients {
		clients {
			results {
				id
				firstName
				lastName
				phoneNumber
				createdAt
			}
		}
	}
`;

export { GET_CLIENTS };
