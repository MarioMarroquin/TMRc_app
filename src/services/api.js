import { useLazyQuery, useQuery } from '@apollo/client';
import { GET_REQUEST } from '@views/main/requests/queryRequests';

const api = {
	fetchRequest: async (id) => {
		const [useIt] = useLazyQuery(GET_REQUEST, {
			variables: { requestId: Number(id) },
		});

		return await useIt()
			.then((res) => res)
			.catch((err) => err);
	},
};

export default api;
