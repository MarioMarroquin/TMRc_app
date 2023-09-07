import { gql } from '@apollo/client';

const GET_MONTH_CALLS_COUNT = gql`
	query MonthlyCallsReport {
		monthlyCallsReport {
			monthlyCalls
			monthlyIngoingCalls
			monthlyOutgoingCalls
		}
	}
`;

export { GET_MONTH_CALLS_COUNT };
