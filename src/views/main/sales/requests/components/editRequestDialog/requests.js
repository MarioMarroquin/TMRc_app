import { gql } from '@apollo/client';

const UPDATE_OBSERVATION = gql`
	mutation UpdateRequestObservation($requestId: ID!, $text: String!) {
		updateRequestObservation(requestId: $requestId, text: $text) {
			id
		}
	}
`;

export { UPDATE_OBSERVATION };
