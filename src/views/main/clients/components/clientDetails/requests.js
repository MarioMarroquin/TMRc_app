import { gql } from '@apollo/client';

const GET_CLIENT = gql`
	query Client($clientId: ID!) {
		client(clientId: $clientId) {
			id
			firstName
			firstLastName
			phoneNumber
			email
			company {
				id
				name
			}
			requests {
				id
				brand {
					id
					name
				}
			}
		}
	}
`;

export { GET_CLIENT };
