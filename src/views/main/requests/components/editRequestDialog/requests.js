import { gql } from '@apollo/client';

const UPDATE_REQUEST = gql`
	mutation UpdateRequest(
		$brandId: ID
		$clientId: ID
		$companyId: ID
		$requestId: ID
		$brand: CreateBrandInput
		$client: CreateClientInput
		$company: CreateCompanyInput
		$request: CreateRequestInput!
	) {
		updateRequest(
			brandId: $brandId
			clientId: $clientId
			companyId: $companyId
			requestId: $requestId
			brand: $brand
			client: $client
			company: $company
			request: $request
		) {
			id
		}
	}
`;

export { UPDATE_REQUEST };
