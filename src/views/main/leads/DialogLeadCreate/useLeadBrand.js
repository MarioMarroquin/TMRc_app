import { useEffect, useState } from 'react';
import useDebounce from '@hooks/use-debounce';
import { GET_BRANDS } from '@views/main/requests/queryRequests';
import { useLazyQuery } from '@apollo/client';

const BlankBrand = {
	id: null,
	name: '',
};

const useLeadBrand = () => {
	const [foundBrands, setFoundBrands] = useState([]);
	const [brand, setBrand] = useState(BlankBrand);
	const [searchBrands, { loading }] = useLazyQuery(GET_BRANDS);
	const debouncedBrand = useDebounce(brand.name, 700);

	// Cargar todas las marcas al iniciar el componente
	useEffect(() => {
		searchBrands({ variables: { text: '' } }).then((res) => {
			if (res?.data?.searchBrands?.results) {
				const aux = res.data.searchBrands.results;
				setFoundBrands(aux);
			}
		});
	}, []);

	// Buscar marcas cuando se escribe
	useEffect(() => {
		if (brand.name) {
			console.log('Buscando marca:', brand.name);
			searchBrands({ variables: { text: brand.name } }).then((res) => {
				if (res?.data?.searchBrands?.results) {
					const aux = res.data.searchBrands.results;
					console.log('Marcas encontradas:', aux);
					setFoundBrands(aux);
				} else if (res.error) {
					console.error('Error en búsqueda:', res.error);
				}
			});
		}
	}, [debouncedBrand]);

	const handleSelectedBrand = (event, newValue) => {
		if (typeof newValue === 'string') {
			setBrand({
				id: null,
				name: newValue,
			});
		} else if (newValue && newValue.id) {
			setBrand({
				id: newValue.id,
				name: newValue.name,
			});
		} else {
			clean();
		}
	};

	const handleInputBrand = (event, newInputValue) => {
		const currentId = brand.id;
		const previousName = brand.name;

		if (!newInputValue) {
			setBrand({
				id: null,
				name: '',
			});
		} else if (
			previousName.length > newInputValue.length ||
			(previousName.length < newInputValue.length && currentId)
		) {
			setBrand({
				id: null,
				name: newInputValue,
			});
		} else {
			setBrand({
				...brand,
				name: newInputValue,
			});
		}
	};

	const clean = () => {
		setBrand(BlankBrand);
		// No limpiamos foundBrands para mantener las opciones disponibles
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
