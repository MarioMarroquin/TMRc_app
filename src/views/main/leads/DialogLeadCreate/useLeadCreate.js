import { useSession } from '@providers/session';
import { useLoaderContext } from '@providers/loader';
import { useEffect, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
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
import useLeadSeller from '@views/main/leads/DialogLeadCreate/useLeadSeller';
import useLeadBrand from '@views/main/leads/DialogLeadCreate/useLeadBrand';
import useLeadCompany from '@views/main/leads/DialogLeadCreate/useLeadCompany';
import useLeadClient from '@views/main/leads/DialogLeadCreate/useLeadClient';
import { CREATE_REQUEST } from '@views/main/requests/mutationRequests';

const BlankData = {
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

const useLeadCreate = (refetchRequests, toggleDialog, isVisible) => {
	const {
		user: { role },
	} = useSession();

	const useSeller = useLeadSeller();
	const useBrand = useLeadBrand();
	const useCompany = useLeadCompany();
	const useClient = useLeadClient();

	const [lead, setLead] = useState(BlankData);

	const [createRequest] = useMutation(CREATE_REQUEST);

	const { loading, loadingOn, loadingOff } = useLoaderContext();

	const handleInputLead = (e) => {
		const { name, value } = e.target;
		setLead({ ...lead, [name]: value });
	};

	const cleanStates = () => {
		useSeller.clean();
		useBrand.clean();
		useCompany.clean();
		useClient.clean();
		setLead(BlankData);

		// setSearchedCompanies([]);
		// setSearchedClients([]);
		// setSearchedBrands([]);
		// setSearchedSellers([]);
	};

	const check = () => {
		if (!lead.serviceType) {
			toast.error('Elige el tipo de servicio');
			return true;
		}

		if (!useBrand.brand.name) {
			toast.error('Elige la marca');
			return true;
		}

		if (useBrand.brand.id || useBrand.brand.name) {
			if (!lead.productStatus) {
				toast.error('Elige el estado de producto');
				return true;
			}
		}

		if (!useClient.client.id) {
			if (
				(useClient.client.firstName && !useClient.client.lastName) ||
				(!useClient.client.firstName && useClient.client.lastName)
			) {
				toast.error('Completa el nombre del cliente.');
				return true;
			}

			if (useClient.client.firstName && useClient.client.lastName) {
				if (!useClient.client.phoneNumber && !useClient.client.email) {
					toast.error('Agrega una forma de contacto');
					return true;
				}

				if (useClient.client.phoneNumber)
					if (useClient.client.phoneNumber.length < 10) {
						toast.error('Número incompleto');
						return true;
					}

				if (useClient.client.email)
					if (!EMAIL.test(useClient.client.email)) {
						toast.error('Revisa el email');
						return true;
					}
			}
		}

		if (!useCompany.company.id) {
			if (useCompany.company.name) {
				// if (!company.phoneNumber && !company.email) {
				// 	toast.error('Agrega una forma de contacto');
				// 	return true;
				// }

				if (useCompany.company.phoneNumber)
					if (useCompany.company.phoneNumber.length < 10) {
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

		if (!useSeller.selectedSeller.id && role !== ROLES.salesOperator) {
			toast.error('Elige un vendedor');
			return true;
		}

		return false;
	};

	const onFinish = (e) => {
		e.preventDefault();

		loadingOn();

		if (check()) {
			loadingOff();
			return;
		}

		const finalRequest = {
			...lead,
			sellerId: useSeller.selectedSeller.id, // tiene que tener de a fuerza
			brandId: useBrand.brand.id ?? null,
			brand: useBrand.brand.name
				? (({ id, ...rest }) => ({
						...rest,
				  }))(useBrand.brand)
				: null,
			clientId: useClient.client.id ?? null,
			client:
				useClient.client.firstName && useClient.client.lastName
					? (({ id, name, ...rest }) => ({
							...rest,
					  }))(useClient.client)
					: null,
			companyId: useCompany.company.id ?? null,
			company: useCompany.company.name
				? (({ id, ...rest }) => ({ ...rest }))(useCompany.company)
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
				loadingOff();
			})
			.catch((err) => {
				console.log('Error', err);
				toast.error('Ocurrio un error');
				loadingOff();
			});
	};

	useEffect(() => {
		BlankData.requestDate = new Date();

		if (isVisible) {
			const aux = { ...BlankData };
			setLead(aux);
		}
	}, [isVisible]);

	return {
		useSeller,
		useBrand,
		useCompany,
		useClient,
		lead,
		setLead,
		handleInputLead,
		cleanStates,
		userRole: role,
		onFinish,
	};
};

export default useLeadCreate;
