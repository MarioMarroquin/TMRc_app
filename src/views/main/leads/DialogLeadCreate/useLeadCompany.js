import { useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import useDebounce from '@hooks/use-debounce';
import { GET_COMPANIES } from '@views/main/requests/queryRequests';

const BlankCompany = {
	id: null,
	name: '',
	phoneNumber: '',
	email: '',
};

const useLeadCompany = () => {
	// COMPANY
	const [foundCompanies, setFoundCompanies] = useState([]);
	const [company, setCompany] = useState(BlankCompany);
	const [searchCompanies, { loading }] = useLazyQuery(GET_COMPANIES);
	const debouncedCompany = useDebounce(company.name, 700);

	// fetch data from server COMPANIES
	useEffect(() => {
		searchCompanies({ variables: { text: company.name } }).then((res) => {
			if (!res.error) {
				const aux = res.data.searchCompanies.results;
				setFoundCompanies(aux);
			} else {
				console.log(res.error);
			}
		});
	}, [debouncedCompany]);

	const handleSelectedCompany = (event, value) => {
		if (!value) {
			setCompany({
				...company,
				id: undefined,
				name: '',
				phoneNumber: '',
				email: '',
			});
		} else {
			setCompany({
				...company,
				id: value.id,
				name: value.name,
				phoneNumber: value.phoneNumber,
				email: value.email,
			});
		}

		// console.log('value', value);
	};

	const handleInputCompany = (event, value) => {
		const actualId = company.id;
		const lastName = company.name;

		if (!value) {
			setCompany({
				...company,
				id: undefined,
				name: '',
			});
		} else if (
			lastName.length > value.length ||
			(lastName.length < value.length && actualId)
		) {
			setCompany({
				...company,
				id: undefined,
				name: value,
			});
		} else {
			setCompany({
				...company,
				name: value,
			});
		}
	};

	const handleInputNumber = (e) => {
		const phoneNumber = e.target.value;

		if (phoneNumber === '') {
			setCompany({ ...company, phoneNumber });
		} else {
			const aux = phoneNumber.split(' ').join('');
			if (/^\d+$/.test(aux) && aux.length <= 10)
				setCompany({ ...company, phoneNumber: aux });
		}
	};

	const handleInputEmail = (e) => {
		const email = e.target.value;

		setCompany({ ...company, email });
	};

	const clean = () => {
		setCompany(BlankCompany);
	};

	return {
		foundCompanies,
		company,
		loading,
		handleSelectedCompany,
		handleInputCompany,
		handleInputNumber,
		handleInputEmail,
		clean,
	};
};
export default useLeadCompany;
