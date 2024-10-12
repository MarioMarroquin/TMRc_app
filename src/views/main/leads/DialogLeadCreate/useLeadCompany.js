const BlankCompany = {
	id: undefined,
	name: '',
	phoneNumber: '',
	email: '',
};

const useLeadCompany = () => {
	// COMPANY
	const [searchedCompanies, setSearchedCompanies] = useState([]);
	const [company, setCompany] = useState(InitialCompany);
	const [searchCompanies, { loading: loadingCompanies }] =
		useLazyQuery(GET_COMPANIES);
	const debouncedCompany = useDebounce(company.name, 700);

	// fetch data from server COMPANIES
	useEffect(() => {
		searchCompanies({ variables: { text: company.name } }).then((res) => {
			if (!res.error) {
				const aux = res.data.searchCompanies.results;
				setSearchedCompanies(aux);
			} else {
				console.log(res.error);
			}
		});
	}, [debouncedCompany]);

	const handleInputOnChangeCompany = (event, value) => {
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

	const handleInputChangeCompany = (event, value) => {
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

	const handlePhoneChangeCompany = (e) => {
		const phoneNumber = e.target.value;

		if (phoneNumber === '') {
			setCompany({ ...company, phoneNumber });
		} else {
			const aux = phoneNumber.split(' ').join('');
			if (/^\d+$/.test(aux) && aux.length <= 10)
				setCompany({ ...company, phoneNumber: aux });
		}
	};

	const handleEmailChangeCompany = (e) => {
		const email = e.target.value;

		setCompany({ ...company, email });
	};

	return {};
};
export default useLeadCompany;
