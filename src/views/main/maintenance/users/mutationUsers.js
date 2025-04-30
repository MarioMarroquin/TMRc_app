import { gql } from '@apollo/client';

const EDIT_USER = gql`
	mutation UpdateUser($userId: ID!, $user: UserUpdateInput) {
		updateUser(userId: $userId, user: $user) {
			id
		}
	}
`;

const CREATE_USER = gql`
	mutation CreateUser($user: UserCreateInput!) {
		createUser(user: $user) {
			id
		}
	}
`;

export { EDIT_USER, CREATE_USER };
