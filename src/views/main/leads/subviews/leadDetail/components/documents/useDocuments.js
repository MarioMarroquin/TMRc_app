import { useLoaderContext } from '@providers/loader';
import { createRef, useState } from 'react';
import { useMutation } from '@apollo/client';
import {
	SAVE_DOCUMENT,
	UPDATE_DOCUMENT,
} from '@views/main/requests/mutationRequests';
import {
	getDownloadURL,
	getMetadata,
	ref,
	uploadBytesResumable,
} from 'firebase/storage';
import { firebaseStorage } from '@config/firebase';
import toast from 'react-hot-toast';

const useDocuments = () => {
	const { loading, loadingOff, loadingOn } = useLoaderContext();
	const [documentTitle, setDocumentTitle] = useState('');
	const [documentFile, setDocumentFile] = useState(null);
	const documentRef = createRef(null);
	const [uploadProgress, setUploadProgress] = useState(0);

	const [saveDocument] = useMutation(SAVE_DOCUMENT);
	const [updateDocument] = useMutation(UPDATE_DOCUMENT);

	const documentInputChange = (e) => {
		const value = e.target.value;
		setDocumentTitle(value);
	};

	const documentSelection = (event) => {
		const doc = event.target?.files?.[0];

		if (doc) {
			setDocumentFile(doc);
		}
	};

	const inputClick = (event) => {
		if (documentFile) {
			event.preventDefault();
			documentRef.current.value = null;
			setDocumentFile(null);
		}
	};

	const cleanStates = () => {
		setDocumentTitle('');
		setDocumentFile(null);
		setUploadProgress(0);
	};

	const uploadTaskPromise = async (storageRef) => {
		return await new Promise((resolve, reject) => {
			const uploadTask = uploadBytesResumable(storageRef, documentFile);

			uploadTask.on(
				'state_changed',
				(snapshot) => {
					const progress = Math.round(
						(snapshot.bytesTransferred / snapshot.totalBytes) * 100
					);

					setUploadProgress(progress);
				},
				(error) => {
					console.log('Error on uploadTask: ', error);
					console.log('Check if resultDocument (savedDocument) exists.');
					console.log('Check if firebase has document, probably not');
					reject(error);
				},
				async () => {
					try {
						const { size } = await getMetadata(storageRef);
						const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

						resolve({ fileSize: size, downloadURL });
					} catch (e) {
						console.log('Error on Metadata/DownloadURL: ', e);
						reject(e);
					}
				}
			);
		});
	};

	const uploadDocument = async (closeDialogUpload, leadId, refetchLead) => {
		loadingOn();
		const loadingToast = toast.loading('Subiendo...');

		try {
			// Document has not been referenced yet to a request.
			const resultDocument = await saveDocument({
				variables: {
					document: { title: documentTitle },
				},
			});

			const savedDocument = resultDocument.data.saveDocument;
			const path = `requests/${leadId}/documents/${savedDocument.id}-${documentTitle}`;
			const storageRef = ref(firebaseStorage, path);

			const documentInfo = await uploadTaskPromise(storageRef);

			const updatedDocument = await updateDocument({
				variables: {
					document: {
						fileSize: documentInfo.fileSize,
						fileURL: documentInfo.downloadURL,
						path,
						requestId: leadId,
					},
					documentId: savedDocument.id,
				},
			});

			toast.success('Documento cargado', { id: loadingToast });
		} catch (e) {
			console.log('Caught on outer function (uploadDocument).', e);
			toast.error('Ha ocurrido un error', {
				id: loadingToast,
			});
		}
		await refetchLead();
		cleanStates();
		closeDialogUpload();
		loadingOff();
	};

	return {
		document: {
			documentFile,
			documentInputChange,
			documentRef,
			documentSelection,
			documentTitle,
			inputClick,
			uploadDocument,
		},
		loading,
		uploadProgress,
	};
};

export default useDocuments;
