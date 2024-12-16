import { useLazyQuery } from '@apollo/client';
import useDebounce from '@hooks/use-debounce';
import { useEffect, useState } from 'react';
import { GET_SELLERS } from '@providers/users/queries';

const BlankSeller = {
	id: null,
	firstName: '',
	lastName: '',
	get name() {
		return (this.firstName + ' ' + this.lastName).trim();
	},
};

const useLeadSeller = () => {
	const [sellersList, setSellersList] = useState([]);
	const [selectedSeller, setSelectedSeller] = useState(BlankSeller);
	const [searchSellers, { loading }] = useLazyQuery(GET_SELLERS);
	const debouncedText = useDebounce(selectedSeller.firstName, 700);
	const [input, setInput] = useState('');

	// const handleInputSeller = (event, value) => {
	// 	const actualId = selectedSeller.id;
	// 	const lastName = selectedSeller.name;
	//
	// 	if (!value) {
	// 		setSelectedSeller({
	// 			...selectedSeller,
	// 			id: undefined,
	// 			firstName: '',
	// 			lastName: '',
	// 		});
	// 	} else if (
	// 		lastName.length > value.length ||
	// 		(lastName.length < value.length && actualId)
	// 	) {
	// 		setSelectedSeller({
	// 			...selectedSeller,
	// 			id: undefined,
	// 			firstName: value,
	// 			lastName: '',
	// 		});
	// 	} else {
	// 		setSelectedSeller({
	// 			...selectedSeller,
	// 			firstName: value,
	// 		});
	// 	}
	// };

	const handleSelectedSeller = (event, value) => {
		if (!value) {
			setSelectedSeller({
				...selectedSeller,
				id: null,
				firstName: '',
				lastName: '',
			});
		} else {
			setSelectedSeller({
				...selectedSeller,
				id: value.id,
				firstName: value.firstName,
				lastName: value.lastName,
			});
		}
	};

	// fetch data from server sellers when debounce changes (asesores)
	useEffect(() => {
		searchSellers({ variables: { text: '' } }).then((res) => {
			if (!res.error) {
				const aux = res.data.searchSellers.results;
				setSellersList(aux);
			} else {
				console.log(res.error);
			}
		});
	}, []);

	const clean = () => {
		setSelectedSeller(BlankSeller);
	};

	return {
		sellersList,
		selectedSeller,
		loading,
		// handleInputSeller,
		handleSelectedSeller,
		clean,
		input,
		setInput,
	};
};

export default useLeadSeller;
