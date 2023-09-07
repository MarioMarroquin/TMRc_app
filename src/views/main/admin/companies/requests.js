import { gql } from '@apollo/client';

const GET_COMPANIES = gql`
	query Companies($params: QueryParams!) {
		companies(params: $params) {
			info {
				count
				next
				pages
				prev
			}
			results {
				id
				name
				phoneNumber
				website
				email
			}
		}
	}
`;

export { GET_COMPANIES };
