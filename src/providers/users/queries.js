import { gql } from '@apollo/client';

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

export { GET_SELLERS };
