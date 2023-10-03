import { gql } from '@apollo/client';

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
	mutation CreateRequest(
		$brandId: ID
		$clientId: ID
		$companyId: ID
		$sellerId: ID
		$brand: CreateBrandInput
		$client: CreateClientInput
		$company: CreateCompanyInput
		$request: CreateRequestInput!
	) {
		createRequest(
			brandId: $brandId
			clientId: $clientId
			companyId: $companyId
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

export { CREATE_REQUEST, GET_BRANDS, GET_CLIENTS, GET_COMPANIES, GET_SELLERS };
