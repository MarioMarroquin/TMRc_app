import { gql } from '@apollo/client';

const GET_REQUEST = gql`
	query Request($requestId: Int!) {
		request(requestId: $requestId) {
			id
			shortId
			requestDate
			serviceType
			contactMedium
			advertisingMedium
			productStatus
			comments
			extraComments
			requestStatus
			isSale
			operatorComments
			managerComments
			assignedUser {
				id
				role
				username
				firstName
				lastName
				phoneNumber
				email
			}
			brand {
				id
				name
			}
			client {
				id
				firstName
				lastName
				phoneNumber
				email
			}
			company {
				id
				name
				phoneNumber
				website
				email
			}
			createdBy {
				id
				role
				username
				firstName
				lastName
				phoneNumber
				email
			}
			documents {
				id
				title
				fileURL
				path
			}
			updatedBy {
				id
				role
				username
				firstName
				lastName
				phoneNumber
				email
			}
			createdAt
			updatedAt
		}
	}
`;

const GET_REQUESTS = gql`
	query Requests(
		$params: QueryParams!
		$dateRange: DateRange!
		$assignedUserId: Int
		$showAll: Boolean!
		$pending: Boolean!
	) {
		requests(
			dateRange: $dateRange
			pending: $pending
			params: $params
			showAll: $showAll
			assignedUserId: $assignedUserId
		) {
			info {
				count
				prev
				next
				pages
			}
			results {
				id
				shortId
				requestDate
				serviceType
				contactMedium
				advertisingMedium
				productStatus
				comments
				extraComments
				requestStatus
				isSale
				operatorComments
				managerComments
				assignedUser {
					id
					role
					username
					firstName
					lastName
					phoneNumber
					email
				}
				brand {
					id
					name
				}
				client {
					id
					firstName
					lastName
					phoneNumber
					email
				}
				company {
					id
					name
					phoneNumber
					website
					email
				}
				createdAt
				updatedAt
				createdBy {
					id
					firstName
					lastName
					username
				}
				updatedBy {
					id
					firstName
					lastName
					username
				}
			}
		}
	}
`;

const GET_BRANDS = gql`
	query SearchBrands($text: String!) {
		searchBrands(text: $text) {
			results {
				id
				name
			}
		}
	}
`;

const GET_CLIENTS = gql`
	query SearchClients($text: String!) {
		searchClients(text: $text) {
			results {
				id
				firstName
				lastName
				email
				phoneNumber
			}
		}
	}
`;

const GET_COMPANIES = gql`
	query SearchCompanies($text: String!) {
		searchCompanies(text: $text) {
			results {
				id
				name
				phoneNumber
				email
			}
		}
	}
`;

const GET_SELLERS = gql`
	query SearchSellers($text: String!) {
		searchSellers(text: $text) {
			results {
				id
				firstName
				lastName
			}
		}
	}
`;

const GET_SELLERS_ALL = gql`
	query Results {
		sellers {
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

export {
	GET_REQUEST,
	GET_REQUESTS,
	GET_BRANDS,
	GET_CLIENTS,
	GET_COMPANIES,
	GET_SELLERS,
	GET_SELLERS_ALL,
};
