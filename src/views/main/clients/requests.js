import { gql } from '@apollo/client';

const GET_CLIENTS = gql`
	query Results($params: QueryParams!) {
		clients(params: $params) {
			results {
				id
				firstName
				lastName
				phoneNumber
				createdAt
			}
			info {
				count
				pages
				prev
				next
			}
		}
	}
`;

const GET_CLIENT = gql`
	query Client($clientId: ID!) {
		client(clientId: $clientId) {
			id
			firstName
			lastName
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

const GET_REQUESTS_BY_CLIENT = gql`
	query RequestsByClient(
		$params: QueryParams!
		$dateRange: DateRange!
		$clientId: ID!
	) {
		requestsByClient(
			params: $params
			dateRange: $dateRange
			clientId: $clientId
		) {
			results {
				id
				extraComments
				createdBy {
					id
					userName
					firstName
					lastName
				}
				createdAt
				contactMedium
				company {
					id
					name
					phoneNumber
					email
					website
				}
				comments
				brand {
					id
					name
				}
				productStatus
				requestDate
				sale
				service
				status
				advertisingMedium
				client {
					id
					firstName
					lastName
					email
					phoneNumber
				}
				user {
					id
					firstName
					lastName
					userName
				}
			}
		}
	}
`;

const UPDATE_CLIENT = gql`
	mutation UpdateClient($clientId: ID!, $client: UpdateClientInput) {
		updateClient(clientId: $clientId, client: $client) {
			id
		}
	}
`;

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

export {
	GET_CLIENTS,
	GET_CLIENT,
	GET_REQUESTS_BY_CLIENT,
	UPDATE_CLIENT,
	CREATE_CLIENT,
};
