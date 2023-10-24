import { gql } from '@apollo/client';

const CREATE_REQUEST = gql`
	mutation CreateRequest($request: CreateRequestInput!) {
		createRequest(request: $request) {
			id
		}
	}
`;

const UPDATE_REQUEST = gql`
	mutation UpdateRequest($request: UpdateRequestInput!, $requestId: Int!) {
		updateRequest(request: $request, requestId: $requestId) {
			id
			shortId
		}
	}
`;

const UPDATE_OPERATOR_COMMENT_REQUEST = gql`
	mutation UpdateRequestOperatorComment(
		$requestId: Int!
		$operatorComments: String!
	) {
		updateRequestOperatorComment(
			requestId: $requestId
			operatorComments: $operatorComments
		) {
			id
		}
	}
`;

const SAVE_DOCUMENT = gql`
	mutation SaveDocument($document: CreateDocumentInput!) {
		saveDocument(document: $document) {
			id
		}
	}
`;

const UPDATE_DOCUMENT = gql`
	mutation UpdateDocument($documentId: Int!, $document: UpdateDocumentInput) {
		updateDocument(documentId: $documentId, document: $document) {
			id
		}
	}
`;

const TRACE_REQUEST = gql`
	mutation TraceRequest($requestId: Int!) {
		traceRequest(requestId: $requestId) {
			id
		}
	}
`;

const FINISH_REQUEST = gql`
	mutation FinishRequest($requestId: Int!, $sale: Boolean!) {
		finishRequest(requestId: $requestId, sale: $sale) {
			id
		}
	}
`;

export {
	CREATE_REQUEST,
	UPDATE_REQUEST,
	UPDATE_OPERATOR_COMMENT_REQUEST,
	SAVE_DOCUMENT,
	UPDATE_DOCUMENT,
	TRACE_REQUEST,
	FINISH_REQUEST,
};
