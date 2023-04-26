import PropTypes from 'prop-types';
import { useLoading } from '@providers/loading';
import { Fragment, useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_COMPANY } from '@views/main/companies/components/newCompanyDialog/requests';
import useGoogle from 'react-google-autocomplete/lib/usePlacesAutocompleteService';
import { googleMapsApiKey } from '@config/environment';
import companies from '@views/main/companies';
import toast from 'react-hot-toast';
import { Button } from '@mui/material';

const InitialCompany = {
	name: '',
	phoneNumber: '',
	website: '',
	email: '',
	addresses: {
		alias: '',
		formattedAddress: '',
		info: '',
		coordinates: [],
	},
};

const EMAIL =
	/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$/;

const WEBSITE =
	/^[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&//=]*)$/;

const NewCompanyDialog = ({ reloadCompanies }) => {
	const { setLoading } = useLoading();
	const [company, setCompany] = useState(InitialCompany);
	const [isVisible, setIsVisible] = useState(false);

	const [createCompany] = useMutation(CREATE_COMPANY);

	const {
		placesService,
		placePredictions,
		getPlacePredictions,
		isPlacePredictionsLoading,
	} = useGoogle({
		apiKey: googleMapsApiKey,
		options: {
			componentRestrictions: { country: 'mx' },
		},
	});

	const resetState = () => setCompany(InitialCompany);

	const toggleDialog = () => {
		setIsVisible((prevState) => !prevState);
		resetState();
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;

		setCompany({ ...company, [name]: value });
	};

	const handlePhoneChange = (e) => {
		const phoneNumber = e.target.value;

		if (phoneNumber === '') {
			setCompany({ ...company, phoneNumber });
		} else {
			if (/^\d+$/.test(phoneNumber)) setCompany({ ...company, phoneNumber });
		}
	};

	const handleInputChangeAddressData = (e) => {
		const { name, value } = e.target;

		setCompany({
			...company,
			addresses: { ...companies.addresses, [name]: value },
		});
	};

	const handleInputChangeAddress = (event, value) => {
		getPlacePredictions({ input: value });

		let newAddress = { ...company.addresses };

		const lastDescription = company.addresses.formattedAddress;
		const actualCoordinates = company.addresses.coordinates;

		if (!value) {
			newAddress = {
				...newAddress,
				formattedAddress: '',
				coordinates: [],
			};

			setCompany({
				...company,
				addresses: newAddress,
			});
		} else if (
			lastDescription.length > value.length ||
			(lastDescription.length < value.length && actualCoordinates.length)
		) {
			newAddress = {
				...newAddress,
				formattedAddress: value,
				coordinates: [],
			};

			setCompany({
				...company,
				addresses: newAddress,
			});
		} else {
			newAddress = { ...newAddress, formattedAddress: value };

			setCompany({
				...company,
				addresses: newAddress,
			});
		}
	};

	const handleInputOnChangeAddress = (event, value) => {
		let newAddress = { ...company.addresses };

		if (!value) {
			newAddress = {
				...newAddress,
				formattedAddress: '',
				coordinates: [],
			};

			setCompany({
				...company,
				addresses: newAddress,
			});
		} else {
			let loc = [];
			placesService?.getDetails(
				{
					placeId: value.place_id,
					fields: ['geometry'],
				},
				(placeDetails) => {
					loc.push(placeDetails.geometry.location.lat());
					loc.push(placeDetails.geometry.location.lng());
				}
			);

			newAddress = {
				...newAddress,
				formattedAddress: value.description,
				coordinates: loc,
			};

			setCompany({
				...company,
				addresses: newAddress,
			});
		}
	};

	const check = () => {
		if (company.name === '') {
			toast('Nombre faltante');
			return true;
		}

		if (company.phoneNumber.length < 10 && company.phoneNumber) {
			toast('Número incompleto');
			return true;
		}

		if (company.email && !EMAIL.test(company.email)) {
			toast('Correo incorrecto');
			return true;
		}

		if (company.website && !WEBSITE.test(company.website)) {
			toast('URL incorrecta');
			return true;
		}

		if (
			company.addresses.formattedAddress &&
			!company.addresses.coordinates.length
		) {
			toast('Dirección incompleta');
			return true;
		}

		return false;
	};

	const onFinish = (e) => {
		e.preventDefault();
		setLoading(true);

		if (check()) {
			setLoading(false);
			return;
		}

		createCompany()
			.then((res) => {
				if (!res.errors) {
					toast.success('Compañía guardada');
					toggleDialog();
					reloadCompanies();
				} else {
					console.log('Errores', res.errors);
					toast.error('Error al guardar');
				}
				setLoading(false);
			})
			.catch((err) => {
				console.log(err);
				setLoading(false);
			});
	};

	return (
		<Fragment>
			<Button disableRipple onClick={toggleDialog}>
				Agregar compañía
			</Button>
		</Fragment>
	);
};

NewCompanyDialog.propTypes = {
	reloadCompanies: PropTypes.func,
};

export default NewCompanyDialog;
