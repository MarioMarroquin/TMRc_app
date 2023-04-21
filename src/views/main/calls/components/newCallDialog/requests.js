import { gql } from '@apollo/client';

const GET_CLIENTS = gql`
	query Results($text: String!) {
		searchClients(text: $text) {
			results {
				id
				firstName
				lastName
				phoneNumber
			}
		}
	}
`;

const CREATE_CALL = gql`
	mutation CreateCall($call: CreateCallInput!, $clientId: ID) {
		createCall(call: $call, clientId: $clientId) {
			id
		}
	}
`;

export { GET_CLIENTS, CREATE_CALL };
