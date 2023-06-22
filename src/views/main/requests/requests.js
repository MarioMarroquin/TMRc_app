import { gql } from '@apollo/client';

const GET_REQUESTS = gql`
	query Requests($dateRange: DateRange!, $params: QueryParams!) {
		requests(dateRange: $dateRange, params: $params) {
			info {
				count
				next
				pages
				prev
			}
			results {
				id
				requestDate
				service
				contactMedium
				advertisingMedium
				user {
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
					firstLastName
				}
				extraComments
				status
				sale
				createdAt
				updatedAt
			}
		}
	}
`;

export { GET_REQUESTS };
