import { gql } from '@apollo/client';

const GET_TOTAL_REQUESTS = gql`
	query TotalRequestsBySeller {
		totalRequestsBySeller {
			total
		}
	}
`;

export { GET_TOTAL_REQUESTS };
