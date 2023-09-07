import { gql } from '@apollo/client';

const GET_REQUESTS = gql`
	query SellerRequestsBySeller(
		$dateRange: DateRange!
		$params: QueryParams!
		$pending: Boolean!
	) {
		sellerRequestsBySeller(
			dateRange: $dateRange
			params: $params
			pending: $pending
		) {
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
				userFor {
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
				}
				client {
					id
					firstName
					lastName
				}
				extraComments
				requestStatus
				isSale
				createdAt
				updatedAt
			}
		}
	}
`;

export { GET_REQUESTS };
