import { gql } from '@apollo/client';

const GET_CALLS = gql`
	query GetCalls($params: QueryParams!) {
		calls(params: $params) {
			results {
				id
				phoneNumber
				duration
				createdAt
				callTime
				purpose
				company {
					id
					name
				}
				client {
					id
					firstName
					lastName
				}
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

export { GET_CALLS };
