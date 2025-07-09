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
import { gql } from '@apollo/client';

const VALIDATE_ENTITY = gql`
	query ValidateEntity($name: String!, $type: String!) {
		validateEntity(name: $name, type: $type) {
			entityData
			entityId
			entityType
			exists
		}
	}
`;

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
	const [validateEntity] = useLazyQuery(VALIDATE_ENTITY);

	const [lead, setLead] = useState(BlankData);

	const [createRequest] = useMutation(CREATE_REQUEST);
	const [validationDialog, setValidationDialog] = useState({
		open: false,
		entityType: null,
		entityName: '',
		entityData: null,
		onUseExisting: null,
		onCreateNew: null,
	});

	const closeValidationDialog = () => {
		setValidationDialog({
			open: false,
			entityType: null,
			entityName: '',
			entityData: null,
			onUseExisting: null,
			onCreateNew: null,
		});
	};

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
				if (useCompany.company.phoneNumber)
					if (useCompany.company.phoneNumber.length < 10) {
						toast.error('Número incompleto');
						return true;
					}
			}
		}

		if (!useSeller.selectedSeller.id && role !== ROLES.salesOperator) {
			toast.error('Elige un vendedor');
			return true;
		}

		return false;
	};

	const createNewLead = async (entityType = null, entityId = null) => {
		try {
			loadingOn();

			const finalRequest = {
				...lead,
				sellerId: useSeller.selectedSeller.id,
				brandId: entityType === 'BRAND' ? entityId : useBrand.brand.id ?? null,
				brand:
					!useBrand.brand.id && useBrand.brand.name
						? (({ id, ...rest }) => ({
								...rest,
						  }))(useBrand.brand)
						: null,
				clientId:
					entityType === 'CLIENT' ? entityId : useClient.client.id ?? null,
				client:
					!useClient.client.id &&
					useClient.client.firstName &&
					useClient.client.lastName
						? {
								firstName: useClient.client.firstName,
								lastName: useClient.client.lastName,
								phoneNumber: useClient.client.phoneNumber || null,
								email: useClient.client.email || null,
						  }
						: null,
				companyId:
					entityType === 'COMPANY' ? entityId : useCompany.company.id ?? null,
				company:
					!useCompany.company.id && useCompany.company.name
						? {
								name: useCompany.company.name,
								phoneNumber: useCompany.company.phoneNumber || null,
								email: useCompany.company.email || null,
						  }
						: null,
			};

			const result = await createRequest({
				variables: { request: finalRequest },
			});

			if (result?.data?.createRequest) {
				toast.success('¡Solicitud creada exitosamente!');
				cleanStates();
				toggleDialog();
				await refetchRequests();
			}
		} catch (error) {
			console.error('Error al crear solicitud:', error);
			toast.error(`Error al crear la solicitud: ${error.message}`);
		} finally {
			loadingOff();
			closeValidationDialog();
		}
	};

	const validateBeforeCreate = async () => {
		if (check()) return;

		try {
			// Validar SOLO la marca primero
			if (useBrand.brand.name && !useBrand.brand.id) {
				const brandName = useBrand.brand.name.trim().toUpperCase();
				console.log('Validando marca (normalizada):', brandName);

				const brandResult = await validateEntity({
					variables: {
						name: brandName,
						type: 'BRAND',
					},
				});

				console.log('Respuesta completa de validación:', brandResult);

				if (!brandResult.data?.validateEntity) {
					console.error('No se recibió respuesta de validación');
					toast.error('Error en la validación de marca');
					return;
				}

				if (brandResult.data.validateEntity.exists) {
					console.log(
						'Marca existente encontrada:',
						brandResult.data.validateEntity
					);
					setValidationDialog({
						open: true,
						entityType: 'BRAND',
						entityName: brandName,
						entityData: brandResult.data.validateEntity.entityData
							? JSON.parse(brandResult.data.validateEntity.entityData)
							: {},
						onUseExisting: async () => {
							try {
								await createNewLead(
									'BRAND',
									brandResult.data.validateEntity.entityId
								);
								toast.success('✅ Registro creado usando marca existente');
								toggleDialog();
							} catch (error) {
								console.error('Error al usar marca existente:', error);
								toast.error(
									'❌ Error al crear el registro con marca existente'
								);
							} finally {
								closeValidationDialog();
							}
						},
						onCreateNew: async () => {
							try {
								await createNewLead();
								toast.success('✅ Registro creado con nueva marca');
								toggleDialog();
							} catch (error) {
								console.error('Error al crear nueva marca:', error);
								toast.error('❌ Error al crear el registro con nueva marca');
							} finally {
								closeValidationDialog();
							}
						},
					});
					return;
				} else {
					// Si la marca no existe, confirmar antes de crear
					const shouldCreate = window.confirm(
						`La marca "${brandName}" no fue encontrada. ¿Desea crear una nueva marca?`
					);

					if (shouldCreate) {
						await createNewLead();
						toast.success('✅ Registro creado con nueva marca');
						toggleDialog();
					}
					return;
				}
			}

			// Validar compañía
			if (useCompany.company.name && !useCompany.company.id) {
				const companyResult = await validateEntity({
					variables: {
						name: useCompany.company.name.trim(),
						type: 'COMPANY',
					},
				});

				if (companyResult.data?.validateEntity.exists) {
					setValidationDialog({
						open: true,
						entityType: 'COMPANY',
						entityName: useCompany.company.name,
						entityData: JSON.parse(
							companyResult.data.validateEntity.entityData
						),
						onUseExisting: async () => {
							try {
								await createNewLead(
									'COMPANY',
									companyResult.data.validateEntity.entityId
								);
								toast.success(
									'✅ Registro creado exitosamente usando compañía existente'
								);
								toggleDialog();
							} catch (error) {
								toast.error(
									'❌ Error al crear el registro con compañía existente'
								);
							}
							closeValidationDialog();
						},
						onCreateNew: async () => {
							try {
								await createNewLead();
								toast.success('✅ Registro creado exitosamente');
								toggleDialog();
							} catch (error) {
								toast.error('❌ Error al crear nueva compañía');
							}
							closeValidationDialog();
						},
					});
					return;
				}
			}

			// Validar cliente
			if (
				useClient.client.firstName &&
				useClient.client.lastName &&
				!useClient.client.id
			) {
				const fullName =
					`${useClient.client.firstName} ${useClient.client.lastName}`.trim();
				const clientResult = await validateEntity({
					variables: {
						name: fullName,
						type: 'CLIENT',
					},
				});

				if (clientResult.data?.validateEntity.exists) {
					setValidationDialog({
						open: true,
						entityType: 'CLIENT',
						entityName: fullName,
						entityData: JSON.parse(clientResult.data.validateEntity.entityData),
						onUseExisting: async () => {
							try {
								await createNewLead(
									'CLIENT',
									clientResult.data.validateEntity.entityId
								);
								toast.success(
									'✅ Registro creado exitosamente usando cliente existente'
								);
								toggleDialog();
							} catch (error) {
								toast.error(
									'❌ Error al crear el registro con cliente existente'
								);
							}
							closeValidationDialog();
						},
						onCreateNew: async () => {
							try {
								await createNewLead();
								toast.success('✅ Registro creado exitosamente');
								toggleDialog();
							} catch (error) {
								toast.error('❌ Error al crear nuevo cliente');
							}
							closeValidationDialog();
						},
					});
					return;
				}
			}

			// Si no hay entidades existentes, crear directamente
			await createNewLead();
			toast.success('✅ Registro creado exitosamente');
			toggleDialog();
		} catch (error) {
			console.error('Error en validación:', error);
			toast.error('Error al validar los datos');
		}
	};

	useEffect(() => {
		BlankData.requestDate = new Date();

		if (isVisible) {
			const aux = { ...BlankData };
			setLead(aux);
		}
	}, [isVisible]);

	useEffect(() => {
		console.log('Estado del diálogo de validación:', validationDialog);
	}, [validationDialog]);

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
		validationDialog,
		closeValidationDialog,
		validateBeforeCreate,
	};
};

export default useLeadCreate;
