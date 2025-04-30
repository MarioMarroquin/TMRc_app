import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_USERS } from '@views/main/maintenance/users/queryUsers.js';

export const useUsers = () => {
	const { data, loading, refetch } = useQuery(GET_USERS);

	return {
		users: {
			list: data?.users.results ?? [],
			fetch: refetch,
			loading,
		},
	};
};
