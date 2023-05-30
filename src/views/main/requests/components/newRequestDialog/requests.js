import { gql } from '@apollo/client';

const GET_CLIENTS = gql`
	query Results($text: String!) {
		searchClients(text: $text) {
			results {
				id
				firstName
				firstLastName
				phoneNumber
			}
		}
	}
`;

export { GET_CLIENTS };
