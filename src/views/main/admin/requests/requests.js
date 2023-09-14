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

export { GET_REQUESTS };
