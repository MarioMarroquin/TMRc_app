import { gql } from '@apollo/client';

const GET_REQUEST = gql`
	query Request($requestId: ID!) {
		request(requestId: $requestId) {
			id
			requestDate
			serviceType
			contactMedium
			advertisingMedium
			comments
			productStatus
			extraComments
			requestStatus
			isSale
			userFor {
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
				lastName
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

const UPDATE_REQUEST_STATUS_SALE = gql`
	mutation NewStatusRequest($requestId: ID!, $status: Boolean!) {
		newStatusRequest(requestId: $requestId, status: $status) {
			id
		}
	}
`;

export { GET_REQUEST, UPDATE_REQUEST_STATUS_SALE };
