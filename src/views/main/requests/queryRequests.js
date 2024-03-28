import { gql } from '@apollo/client';

const GET_REQUEST = gql`
	query Request($requestId: Int!) {
		request(requestId: $requestId) {
			advertisingMedium
			assignedUser {
				email
				firstName
				id
				lastName
				phoneNumber
				role
				username
			}
			brand {
				id
				name
			}
			client {
				email
				firstName
				id
				lastName
				phoneNumber
			}
			comments
			company {
				email
				id
				name
				phoneNumber
				website
			}
			contactMedium
			createdAt
			createdBy {
				email
				firstName
				lastName
				id
				phoneNumber
				role
				username
			}
			documents {
				createdAt
				fileSize
				fileURL
				id
				path
				title
			}
			extraComments
			id
			isSale
			managerComments {
				comment
				createdAt
				createdBy {
					firstName
					id
					lastName
				}
				id
			}
			operatorComments {
				comment
				createdAt
				createdBy {
					firstName
					id
					lastName
				}
				id
			}
			productStatus
			requestDate
			requestStatus
			serviceType
			shortId
			updatedAt
			updatedBy {
				email
				firstName
				lastName
				id
				phoneNumber
				role
				username
			}
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
				pages
				prev
				next
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
					email
					website
				}
				createdAt
				createdBy {
					id
					role
					username
					firstName
					lastName
				}
				updatedAt
				updatedBy {
					id
					role
					username
					firstName
					lastName
				}
				operatorComments {
					id
					comment
					createdAt
				}
				managerComments {
					id
					comment
					createdAt
				}
				documents {
					id
					title
					path
					fileURL
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
