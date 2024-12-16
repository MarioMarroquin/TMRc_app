import { useEffect, useState } from 'react';
import useDebounce from '@hooks/use-debounce';
import { GET_BRANDS } from '@views/main/requests/queryRequests';
import { useLazyQuery } from '@apollo/client';

const BlankBrand = {
	id: undefined, // " "
	name: '',
};

const useLeadBrand = () => {
	const [foundBrands, setFoundBrands] = useState([]);
	const [brand, setBrand] = useState(BlankBrand);
	const [searchBrands, { loading }] = useLazyQuery(GET_BRANDS);
	const debouncedBrand = useDebounce(brand.name, 700);

	useEffect(() => {
		searchBrands({ variables: { text: brand.name } }).then((res) => {
			if (!res.error) {
				const aux = res.data.searchBrands.results;
				setFoundBrands(aux);
			} else {
				console.log(res.error);
			}
		});
	}, [debouncedBrand]);

	// const handleInputOnChangeBrand = (event, value) => {
	const handleSelectedBrand = (event, value) => {
		if (!value) {
			setBrand({
				...brand,
				id: undefined,
				name: '',
			});
		} else {
			setBrand({
				...brand,
				id: value.id,
				name: value.name,
			});
		}
	};

	// const handleInputChangeBrand = (event, value) => {
	const handleInputBrand = (event, value) => {
		const actualId = brand.id;
		const lastName = brand.name;

		if (!value) {
			setBrand({
				...brand,
				id: undefined,
				name: '',
			});
		} else if (
			lastName.length > value.length ||
			(lastName.length < value.length && actualId)
		) {
			setBrand({
				...brand,
				id: undefined,
				name: value,
			});
		} else {
			setBrand({
				...brand,
				name: value,
			});
		}
	};

	const clean = () => {
		setBrand(BlankBrand);
	};

	return {
		foundBrands,
		brand,
		loading,
		handleSelectedBrand,
		handleInputBrand,
		clean,
	};
};

export default useLeadBrand;
