import { gql } from '@apollo/client';

const GET_SIGNED_URL = gql`
	query signFileUrl($filePath: String!, $fileType: String!) {
		signFileUrl(filePath: $filePath, fileType: $fileType) {
			signedUrl
			fileUrl
		}
	}
`;

export { GET_SIGNED_URL };
