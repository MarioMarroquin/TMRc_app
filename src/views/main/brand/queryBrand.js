import { gql } from '@apollo/client';

export const GET_BRANDS = gql`
	query Brands($params: QueryParams!) {
		brands(params: $params) {
			results {
				id
				name
				createdBy {
					id
					username
					role
					createdAt
				}
				updatedBy {
					id
					username
					role
					createdAt
				}
			}
			info {
				count
				next
				pages
				prev
			}
		}
	}
`;
