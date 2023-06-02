import { gql } from '@apollo/client';

const GET_REQUEST = gql`
	query Request($requestId: ID!) {
		request(requestId: $requestId) {
			id
			requestDate
			service
			contactMedium
			advertisingMedium
			comments
			productStatus
			extraComments
			status
			sale
			user {
				id
				firstName
				lastName
				email
			}
			brand {
				id
				name
			}
			company {
				id
				name
				phoneNumber
				email
				website
			}
			client {
				id
				firstName
				firstLastName
				email
				phoneNumber
			}
			createdAt
			createdBy {
				id
				firstName
				lastName
				email
				userName
			}
			updatedAt
			updatedBy {
				id
				firstName
				lastName
				userName
				email
			}
		}
	}
`;

export { GET_REQUEST };
