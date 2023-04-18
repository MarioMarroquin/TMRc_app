import { gql } from '@apollo/client';

const GET_CLIENT = gql`
	query Client($clientId: ID!) {
		client(clientId: $clientId) {
			id
			firstName
			lastName
			phoneNumber
			addresses {
				id
				alias
				formattedAddress
				coordinates
			}
			createdAt
			company {
				id
				name
				phoneNumber
				email
			}
			calls {
				id
				createdAt
				phoneNumber
				callTime
			}
			tasks {
				id
				name
				description
				createdAt
				completed
				dueDate
			}
		}
	}
`;

export { GET_CLIENT };
