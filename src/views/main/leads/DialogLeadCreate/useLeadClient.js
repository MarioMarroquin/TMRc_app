import { useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { GET_CLIENTS } from '@views/main/clients/requests';
import useDebounce from '@hooks/use-debounce';
import titleCaseClean from '@utils/formatters/titleCaseClean';

const BlankClient = {
	id: undefined,
	firstName: '',
	lastName: '',
	phoneNumber: '',
	email: '',
	get name() {
		return (this.firstName + ' ' + this.lastName).trim();
	},
};

const useLeadClient = () => {
	// CLIENTES
	const [foundClients, setFoundClients] = useState([]);
	const [client, setClient] = useState(BlankClient);
	const [searchClients, { loading }] = useLazyQuery(GET_CLIENTS);
	const debouncedClient = useDebounce(client.firstName, 700);

	// fetch data from server CLIENTS
	useEffect(() => {
		searchClients({ variables: { text: client.firstName } }).then((res) => {
			if (!res.error) {
				const aux = res.data.searchClients.results;
				setFoundClients(aux);
			} else {
				console.log(res.error);
			}
		});
	}, [debouncedClient]);

	const handleSelectedClient = (event, value) => {
		if (!value) {
			setClient({
				...client,
				id: undefined,
				firstName: '',
				lastName: '',
				phoneNumber: '',
				email: '',
			});
		} else {
			setClient({
				...client,
				id: value.id,
				firstName: value.firstName,
				lastName: value.lastName,
				phoneNumber: value.phoneNumber,
				email: value.email,
			});
		}
	};

	const handleInputClientName = (event, value) => {
		const actualId = client.id;
		const lastName = client.name;

		const auxValue = titleCaseClean(value);

		if (!value) {
			setClient({
				...client,
				id: undefined,
				firstName: '',
				lastName: '',
			});
		} else if (
			lastName.length > auxValue.length ||
			(lastName.length < auxValue.length && actualId)
		) {
			setClient({
				...client,
				id: undefined,
				firstName: auxValue,
			});
		} else {
			setClient({
				...client,
				firstName: auxValue,
			});
		}
	};

	const handleInputNumber = (e) => {
		const phoneNumber = e.target.value;

		if (phoneNumber === '') {
			setClient({ ...client, phoneNumber });
		} else {
			const aux = phoneNumber.split(' ').join('');
			if (/^\d+$/.test(aux) && aux.length <= 10)
				setClient({ ...client, phoneNumber: aux });
		}
	};

	const handleInputEmail = (e) => {
		const email = e.target.value;

		setClient({ ...client, email });
	};

	const handleInputClientLastName = (e) => {
		const lastName = e.target.value;
		const existId = client.id;
		const aux = titleCaseClean(lastName);

		existId
			? // deletes id cuz is new client
			  setClient({ ...client, id: undefined, lastName: aux })
			: setClient({ ...client, lastName: aux });
	};

	const clean = () => {
		setClient(BlankClient);
	};

	return {
		foundClients,
		client,
		loading,
		handleInputClientName,
		handleInputClientLastName,
		handleSelectedClient,
		handleInputNumber,
		handleInputEmail,
		clean,
	};
};

export default useLeadClient;
