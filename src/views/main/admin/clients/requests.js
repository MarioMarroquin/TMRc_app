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

export { GET_CLIENTS };
