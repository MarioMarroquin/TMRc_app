import { gql } from '@apollo/client';

const GET_USER_BY_TOKEN = gql`
	query UserByToken {
		userByToken {
			id
			userName
			overallRole
			createdAt
		}
	}
`;

export { GET_USER_BY_TOKEN };
