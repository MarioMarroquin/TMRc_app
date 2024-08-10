import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useLoaderContext } from '@providers/loader';
import { useMutation, useQuery } from '@apollo/client';
import { GET_REQUEST } from '@views/main/requests/queryRequests';
import {
	FINISH_REQUEST,
	QUOTED_REQUEST,
	TRACE_REQUEST,
} from '@views/main/requests/mutationRequests';
import { RequestStatusList } from '@utils/enums';
import toast from 'react-hot-toast';
import { ROLES } from '@config/permisissions/permissions';
import { useSession } from '@providers/session';

const useLeadDetail = () => {
	const params = useParams(); // id
	const loader = useLoaderContext();
	const navigate = useNavigate();
	const { role, user } = useSession();

	const [dialogDocumentUploadState, setDialogDocumentUploadState] = useState({
		visible: false,
		leadId: null, // Need to change backend variable name
	});

	const openDialogDocumentUpload = (leadId) => {
		setDialogDocumentUploadState({ visible: true, leadId });
	};

	const closeDialogDocumentUpload = () => {
		setDialogDocumentUploadState({ visible: false, leadId: null });
	};

	const { data, error, loading, refetch } = useQuery(GET_REQUEST, {
		variables: { requestId: Number(params.id) }, // tiene que ser Number porque params lo hace string
	});

	useEffect(() => {
		if (loading) {
			console.log('entra');
			loader.loadingOn();
		} else {
			loader.loadingOff();
		}

		console.log('Lead id: ' + params.id, data);
	}, [loading]);

	const [traceRequest] = useMutation(TRACE_REQUEST);
	const [quotedRequest] = useMutation(QUOTED_REQUEST);
	const [finishRequest] = useMutation(FINISH_REQUEST);

	const updateLeadTrace = async () => {
		return await new Promise((resolve, reject) => {
			traceRequest({
				variables: { requestId: Number(params.id) },
			})
				.then((res) => {
					resolve(res);
				})
				.catch((e) => {
					console.log('Catch error on updateLeadTrace: ', e);
					toast.error('Error al intentar cambiar estatus.');
					reject(e);
				});
		});
	};

	const updateLeadQuoted = async () => {
		return await new Promise((resolve, reject) => {
			quotedRequest({
				variables: { requestId: Number(params.id) },
			})
				.then((res) => {
					resolve(res);
				})
				.catch((e) => {
					console.log('Catch error on updateLeadQuoted: ', e);
					toast.error('Error al intentar cambiar estatus.');
					reject(e);
				});
		});
	};

	const updateLeadFinish = async (sale) => {
		return await new Promise((resolve, reject) => {
			finishRequest({
				variables: {
					requestId: Number(params.id),
					sale,
				},
			})
				.then((res) => {
					toast.error('Solicitud terminada.');
					resolve(res);
				})
				.catch((e) => {
					console.log('Catch error on updateLeadFinish: ', e);
					toast.error('Error al intentar cambiar estatus.');
					reject(e);
				});
		});
	};

	const handleLeadStatus = async (status, sale = false) => {
		loader.loadingOn();
		let leadStatus;

		try {
			switch (status) {
				case RequestStatusList.TRACING.name:
					leadStatus = await updateLeadTrace();
					break;

				case RequestStatusList.QUOTED.name:
					leadStatus = await updateLeadQuoted();
					break;

				case RequestStatusList.FINISHED.name:
					leadStatus = await updateLeadFinish(sale);
					break;
			}
		} catch (e) {
			console.log('Caught on outer function (handleLeadStatus).', e);
			leadStatus = e;
		}

		await refetch();
		loader.loadingOff();

		return leadStatus;
	};

	const renderCommentsList = () => {
		if (role !== ROLES.salesManager) return true;

		return !(
			role === ROLES.salesManager && data?.request.assignedUser.id === user.id
		);
	};

	const goToRequests = () => {
		navigate('/requests');
	};

	return {
		commentsByOperator: data?.request.operatorComments ?? [],
		commentsByManager: data?.request.managerComments ?? [],
		dialogDocumentUploadState,
		closeDialogDocumentUpload,
		documents: data?.request.documents ?? [],
		handleLeadStatus,
		lead: data?.request,
		loading: loading,
		openDialogDocumentUpload,
		refetch,
		renderCommentsList,
		userId: user.id,
		goToRequests,
	};
};

export default useLeadDetail;
