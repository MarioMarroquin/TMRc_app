import { useSession } from '@providers/session';
import { useLoaderContext } from '@providers/loader';
import { useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import {
	GET_BRANDS,
	GET_CLIENTS,
	GET_COMPANIES,
	GET_SELLERS,
} from '@views/main/requests/queryRequests';
import useDebounce from '@hooks/use-debounce';
import titleCaseClean from '@utils/formatters/titleCaseClean';
import toast from 'react-hot-toast';
import { ROLES } from '@config/permisissions/permissions';

const BlankLead = {
	requestDate: new Date(),
	serviceType: '',
	contactMedium: '',
	advertisingMedium: '',
	productStatus: '',
	comments: '',
	extraComments: '',
	requestStatus: 'PENDING',
	isSale: null,
};

const EMAIL = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

const useLeadCreate = () => {
	const {
		user: { role },
	} = useSession();
	const { loading, loadingOn } = useLoaderContext();
	const [lead, setLead] = useState(BlankLead);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setRequest({ ...request, [name]: value });
	};

	const cleanStates = () => {
		setRequest(InitialRequest);
		setClient(InitialClient);
		setBrand(InitialBrand);
		setCompany(InitialCompany);
		setSeller(InitialSeller);
		setSearchedCompanies([]);
		setSearchedClients([]);
		setSearchedBrands([]);
		setSearchedSellers([]);
	};

	const check = () => {
		if (!request.serviceType) {
			toast.error('Elige el tipo de servicio');
			return true;
		}

		if (!brand.name) {
			toast.error('Elige la marca');
			return true;
		}

		if (brand.id || brand.name) {
			if (!request.productStatus) {
				toast.error('Elige el estado de producto');
				return true;
			}
		}

		if (!client.id) {
			if (
				(client.firstName && !client.lastName) ||
				(!client.firstName && client.lastName)
			) {
				toast.error('Completa el nombre del cliente.');
				return true;
			}

			if (client.firstName && client.lastName) {
				if (!client.phoneNumber && !client.email) {
					toast.error('Agrega una forma de contacto');
					return true;
				}

				if (client.phoneNumber)
					if (client.phoneNumber.length < 10) {
						toast.error('Número incompleto');
						return true;
					}

				if (client.email)
					if (!EMAIL.test(client.email)) {
						toast.error('Revisa el email');
						return true;
					}
			}
		}

		if (!company.id) {
			if (company.name) {
				// if (!company.phoneNumber && !company.email) {
				// 	toast.error('Agrega una forma de contacto');
				// 	return true;
				// }

				if (company.phoneNumber)
					if (company.phoneNumber.length < 10) {
						toast.error('Número incompleto');
						return true;
					}

				// if (company.email)
				// 	if (!EMAIL.test(company.email)) {
				// 		toast.error('Revisa el email');
				// 		return true;
				// 	}
			}
		}

		if (!seller.id && role !== ROLES.salesOperator) {
			toast.error('Elige un vendedor');
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

		const finalRequest = {
			...request,
			sellerId: seller.id, // tiene que tener de a fuerza
			brandId: brand.id ?? null,
			brand: brand.name
				? (({ id, ...rest }) => ({
						...rest,
				  }))(brand)
				: null,
			clientId: client.id ?? null,
			client:
				client.firstName && client.lastName
					? (({ id, name, ...rest }) => ({
							...rest,
					  }))(client)
					: null,
			companyId: company.id ?? null,
			company: company.name
				? (({ id, ...rest }) => ({ ...rest }))(company)
				: null,
		};

		// console.log('comp', company);
		// console.log('akliii', finalRequest);

		if (!finalRequest.clientId && finalRequest.client) {
			if (!finalRequest.client.email.length) finalRequest.client.email = null;

			if (!finalRequest.client.phoneNumber.length)
				finalRequest.client.phoneNumber = null;
		}

		if (!finalRequest.companyId && finalRequest.company) {
			if (!finalRequest.company.email.length) finalRequest.company.email = null;

			if (!finalRequest.company.phoneNumber.length)
				finalRequest.company.phoneNumber = null;
		}

		createRequest({ variables: { request: finalRequest } })
			.then((res) => {
				if (!res.errors) {
					toast.success('Solicitud creada');
					refetchRequests();
					toggleDialog();
				} else {
					console.log('Errores', res.errors);
					toast.error('Error al crear');
				}
				cleanStates();
				setLoading(false);
			})
			.catch((err) => {
				console.log('Error', err);
				toast.error('Ocurrio un error');
				setLoading(false);
			});
	};

	useEffect(() => {
		InitialRequest.requestDate = new Date();

		if (isVisible) {
			const aux = { ...InitialRequest };
			setRequest(aux);
		}
	}, [isVisible]);

	const isAv = () => {
		return Boolean(client.firstName);
	};

	return {};
};
