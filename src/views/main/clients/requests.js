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
				company {
					id
					name
				}
			}
		}
	}
`;

export { GET_CLIENTS };
