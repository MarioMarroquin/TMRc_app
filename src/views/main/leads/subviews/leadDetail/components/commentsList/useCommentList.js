import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_REQUEST_COMMENT } from '@views/main/requests/mutationRequests';
import { useLoaderContext } from '@providers/loader';
import toast from 'react-hot-toast';
import { useSession } from '@providers/session';

const useCommentList = () => {
	const { loading, loadingOff, loadingOn } = useLoaderContext();
	const { role, user } = useSession();

	const [newComment, setNewComment] = useState('');

	const [dialogCommentCreateState, setDialogCommentCreateState] = useState({
		visible: false,
		leadId: null, // Need to change backend variable name
	});

	const [dialogCommentsListFull, setDialogCommentsListFull] = useState(false);

	const commentInputChange = (e) => {
		const { value } = e.target;
		setNewComment(value);
	};

	const [createRequestComment] = useMutation(CREATE_REQUEST_COMMENT);

	const openDialogCreate = (leadId) => {
		setDialogCommentCreateState({ visible: true, leadId });
	};

	const closeDialogCreate = () => {
		setDialogCommentCreateState({ visible: false, leadId: null });
		setNewComment('');
	};

	const openDialogList = () => {
		setDialogCommentsListFull(true);
	};

	const closeDialogList = () => {
		setDialogCommentsListFull(false);
	};

	const createComment = async (refetchRequest) => {
		loadingOn();
		const loadingToast = toast.loading('Creando...');

		const requestComment = {
			requestId: dialogCommentCreateState.leadId,
			newComment,
		};

		try {
			const result = await createRequestComment({
				variables: { requestComment },
			});

			toast.dismiss(loadingToast);
		} catch (e) {
			console.log('Catch error on createComment: ', e);
			toast.error('Ha ocurrido un error', {
				id: loadingToast,
			});
		}

		await refetchRequest();
		closeDialogCreate();
		loadingOff();
	};

	return {
		closeDialogCreate,
		commentInputChange,
		createComment,
		dialogCommentCreateState,
		loading,
		newComment,
		openDialogCreate,
		role,
		userId: user.id,
		openDialogList,
		closeDialogList,
		dialogCommentsListFull,
	};
};

export default useCommentList;
