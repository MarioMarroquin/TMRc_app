import { gql } from '@apollo/client';

const GET_TOTAL_REQUESTS = gql`
	query TotalRequestsMonthlyBySeller {
		totalRequestsMonthlyBySeller {
			total
		}
	}
`;

export { GET_TOTAL_REQUESTS };
