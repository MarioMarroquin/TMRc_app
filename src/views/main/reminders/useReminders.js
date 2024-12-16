import { useQuery } from '@apollo/client';
import { GET_LEAD_REMINDERS } from '@views/main/reminders/queryLeadReminders';
import { useEffect } from 'react';

const useReminders = () => {
	const { data, error, loading, refetch } = useQuery(GET_LEAD_REMINDERS);

	useEffect(() => {
		console.log(data);
	}, [data]);
	return {
		reminders: {},
	};
};

export default useReminders;
