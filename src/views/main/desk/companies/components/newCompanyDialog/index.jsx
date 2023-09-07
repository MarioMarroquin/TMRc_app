import PropTypes from 'prop-types';
import { useLoading } from '@providers/loading';
import { Fragment, useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_COMPANY } from '@views/main/desk/companies/components/newCompanyDialog/requests';
import companies from '@views/main/desk/companies';
import toast from 'react-hot-toast';
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Grid,
	InputAdornment,
	TextField,
} from '@mui/material';

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

		const companyObj = {
			name: company.name,
			phoneNumber: company.phoneNumber,
			website: company.website,
			email: company.email,
		};

		createCompany({ variables: { company: companyObj } })
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
			<Button sx={{ ml: 'auto' }} disableRipple onClick={toggleDialog}>
				Agregar compañía
			</Button>

			<Dialog open={isVisible} onClose={toggleDialog} maxWidth={'xs'}>
				<DialogTitle>Nueva compañía</DialogTitle>
				<DialogContent>
					<Grid container columnSpacing={1}>
						<Grid item xs={12}>
							<TextField
								fullWidth
								id={'name'}
								name={'name'}
								label={'Nombre'}
								value={company.name}
								onChange={handleInputChange}
							/>
						</Grid>

						<Grid item xs={12}>
							<TextField
								fullWidth
								id={'phoneNumber'}
								name={'phoneNumber'}
								label={'Teléfono'}
								value={company.phoneNumber}
								onChange={handlePhoneChange}
								inputProps={{ maxLength: 10, inputMode: 'numeric' }}
								InputProps={{
									startAdornment: (
										<InputAdornment position='start'>+52</InputAdornment>
									),
								}}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								fullWidth
								id={'email'}
								name={'email'}
								label={'Correo electrónico'}
								value={company.email}
								onChange={handleInputChange}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								fullWidth
								id={'website'}
								name={'website'}
								label={'Sitio web'}
								value={company.website}
								onChange={handleInputChange}
							/>
						</Grid>
					</Grid>
				</DialogContent>
				<DialogActions>
					<Button onClick={onFinish}>Registrar</Button>
				</DialogActions>
			</Dialog>
		</Fragment>
	);
};

NewCompanyDialog.propTypes = {
	reloadCompanies: PropTypes.func,
};

export default NewCompanyDialog;
