import { useLazyQuery } from '@apollo/client';
import useDebounce from '@hooks/use-debounce';
import { useEffect, useState } from 'react';
import { GET_SELLERS } from '@providers/users/queries';

const BlankSeller = {
	id: undefined,
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

	const inputChangeSeller = (event, value) => {
		const actualId = selectedSeller.id;
		const lastName = selectedSeller.name;

		if (!value) {
			setSelectedSeller({
				...selectedSeller,
				id: undefined,
				firstName: '',
				lastName: '',
			});
		} else if (
			lastName.length > value.length ||
			(lastName.length < value.length && actualId)
		) {
			setSelectedSeller({
				...selectedSeller,
				id: undefined,
				firstName: value,
				lastName: '',
			});
		} else {
			setSelectedSeller({
				...selectedSeller,
				firstName: value,
			});
		}
	};

	const onSelectSeller = (event, value) => {
		if (!value) {
			setSelectedSeller({
				...selectedSeller,
				id: undefined,
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
		searchSellers({ variables: { text: selectedSeller.firstName } }).then(
			(res) => {
				if (!res.error) {
					const aux = res.data.searchSellers.results;
					setSellersList(aux);
				} else {
					console.log(res.error);
				}
			}
		);
	}, [debouncedText]);

	return { sellersList, selectedSeller, inputChangeSeller, onSelectSeller };
};

export default useLeadSeller;
