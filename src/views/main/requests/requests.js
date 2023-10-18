import { gql } from '@apollo/client';

const GET_REQUESTS = gql`
	query Requests(
		$dateRange: DateRange!
		$pending: Boolean!
		$params: QueryParams!
	) {
		requests(dateRange: $dateRange, params: $params, pending: $pending) {
			info {
				count
				next
				pages
				prev
			}
			results {
				id
				requestDate
				serviceType
				contactMedium
				advertisingMedium
				assignedUser {
					id
					firstName
					lastName
				}
				brand {
					id
					name
				}
				productStatus
				comments
				company {
					id
					name
					phoneNumber
					email
				}
				client {
					id
					firstName
					lastName
					phoneNumber
					email
				}
				extraComments
				requestStatus
				isSale
				createdAt
				updatedAt
				createdBy {
					id
					firstName
					lastName
				}
			}
		}
	}
`;

const UPDATE_REQUEST = gql`
	mutation UpdateRequest(
		$brandId: ID
		$clientId: ID
		$companyId: ID
		$requestId: ID
		$sellerId: ID
		$brand: UpdateBrandInput
		$client: UpdateClientInput
		$company: UpdateCompanyInput
		$request: UpdateRequestInput!
	) {
		updateRequest(
			brandId: $brandId
			clientId: $clientId
			companyId: $companyId
			requestId: $requestId
			sellerId: $sellerId
			brand: $brand
			client: $client
			company: $company
			request: $request
		) {
			id
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

const CREATE_REQUEST = gql`
	mutation CreateRequest($request: CreateRequestInput!) {
		createRequest(request: $request) {
			id
		}
	}
`;

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

const STATUS_REQUEST = gql`
	mutation NewStatusRequest($requestId: ID!, $status: Boolean!) {
		newStatusRequest(requestId: $requestId, status: $status) {
			id
		}
	}
`;

export {
	GET_REQUESTS,
	UPDATE_REQUEST,
	GET_CLIENTS,
	GET_COMPANIES,
	GET_SELLERS,
	CREATE_REQUEST,
	GET_BRANDS,
	STATUS_REQUEST,
	GET_REQUEST,
};
