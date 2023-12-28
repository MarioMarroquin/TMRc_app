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

const UPDATE_MANAGER_COMMENT_REQUEST = gql`
	mutation UpdateManagerOperatorComment(
		$requestId: Int!
		$managerComments: String!
	) {
		updateRequestManagerComment(
			requestId: $requestId
			managerComments: $managerComments
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

const QUOTED_REQUEST = gql`
	mutation QuotedRequest($requestId: Int!) {
		quotedRequest(requestId: $requestId) {
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

const CREATE_REQUEST_COMMENT = gql`
	mutation CreateRequestComment($requestComment: CreateRequestCommentInput!) {
		createRequestComment(requestComment: $requestComment) {
			id
		}
	}
`;

export {
	CREATE_REQUEST,
	CREATE_REQUEST_COMMENT,
	UPDATE_REQUEST,
	UPDATE_OPERATOR_COMMENT_REQUEST,
	UPDATE_MANAGER_COMMENT_REQUEST,
	SAVE_DOCUMENT,
	UPDATE_DOCUMENT,
	TRACE_REQUEST,
	QUOTED_REQUEST,
	FINISH_REQUEST,
};
