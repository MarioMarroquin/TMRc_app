import { gql } from '@apollo/client';

const GET_USERS = gql`
	query Results {
		users {
			results {
				id
				role
				username
				firstName
				lastName
				phoneNumber
				email
			}
		}
	}
`;

export { GET_USERS };
