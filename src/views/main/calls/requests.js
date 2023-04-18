import { gql } from '@apollo/client';

const GET_CALLS = gql`
	query Results {
		calls {
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
		}
	}
`;

export { GET_CALLS };
