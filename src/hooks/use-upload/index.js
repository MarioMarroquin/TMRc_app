import { useGraphqlUpload } from 'use-upload';
import { GET_SIGNED_URL } from './requests';
import client from '@graphql';

const useUpload = () => {
	const { upload: originalUpload, ...rest } = useGraphqlUpload(GET_SIGNED_URL, {
		apolloClient: client,
	});

	const upload = (file, filePath) =>
		originalUpload(file, {
			variables: { filePath, fileType: file.type },
			fetchPolicy: 'network-only',
		});

	return { upload, ...rest };
};

export default useUpload;
