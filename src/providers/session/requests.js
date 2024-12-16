import { gql } from '@apollo/client';

const GET_USER_BY_TOKEN = gql`
	query UserByToken {
		userByToken {
			id
			role
			username
			firstName
			lastName
			phoneNumber
			email
			createdAt
		}
	}
`;

export { GET_USER_BY_TOKEN };
