import { gql } from '@apollo/client';

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

export { UPDATE_REQUEST };
