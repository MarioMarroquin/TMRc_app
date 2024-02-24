import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
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

const useLeadDetail = () => {
	const params = useParams(); // id
	const loader = useLoaderContext();
	const navigate = useNavigate();

	const { data, error, loading, refetch } = useQuery(GET_REQUEST, {
		variables: { requestId: Number(params.id) }, // tiene que ser Number porque params lo hace string
	});

	useEffect(() => {
		console.log('data: ', data);
	}, [data]);

	const [traceRequest] = useMutation(TRACE_REQUEST);
	const [quotedRequest] = useMutation(QUOTED_REQUEST);
	const [finishRequest] = useMutation(FINISH_REQUEST);

	const updateLeadTrace = async () => {
		try {
			const result = await traceRequest({
				variables: { requestId: Number(params.id) },
			});
		} catch (e) {
			console.log('Catch error on updateLeadTrace: ', e);
			toast.error('Ha ocurrido un error');
		}
	};

	const updateLeadQuoted = async () => {
		try {
			const result = await quotedRequest({
				variables: { requestId: Number(params.id) },
			});
		} catch (e) {
			console.log('Catch error on updateLeadFinish: ', e);
			toast.error('Ha ocurrido un error');
		}
	};

	const updateLeadFinish = async (sale) => {
		try {
			const result = await finishRequest({
				variables: {
					requestId: Number(params.id),
					sale,
				},
			});
		} catch (e) {
			console.log('Catch error on updateLeadFinish: ', e);
			toast.error('Ha ocurrido un error');
		}
	};

	const handleLeadStatus = async (status, sale = false) => {
		loader.loadingOn();
		switch (status) {
			case RequestStatusList.TRACING.name:
				await updateLeadTrace();
				break;

			case RequestStatusList.QUOTED.name:
				await updateLeadQuoted();
				break;

			case RequestStatusList.FINISHED.name:
				await updateLeadFinish(sale);
				break;
		}

		await refetch();
		loader.loadingOff();
	};

	return {
		commentsByOperator: data?.request.commentsByOperator ?? [],
		commentsByManager: data?.request.commentsByManager ?? [],
		documents: data?.request.documents ?? [],
		lead: data?.request,
		loading: loader.loading,
	};
};

export default useLeadDetail;
