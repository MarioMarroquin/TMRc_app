const ServiceType = {
	SALE: 'VENTA',
	RENT: 'RENTA',
	RENTSALE: 'RENTA / VENTA',
	REF: 'REF',
	SERVICE: 'SERVICIO',
};

const ContactMedium = [
	'WHATSAPP',
	'RECEPCION',
	'CORREO',
	'LLAMADA',
	'PRESENCIAL',
	'FACEBOOK',
	'INSTAGRAM',
	'MERCADO LIBRE',
];

const ProductStatus = {
	NEW: 'NUEVO',
	USED: 'USADO',
};

const RequestStatus = {
	PENDING: 'PENDIENTE',
	TRACING: 'EN CURSO',
	QUOTED: 'COTIZADO',
	FINISHED: 'CONCLUIDO',
};

const RequestStatusList = {
	PENDING: { format: 'PENDIENTE', name: 'PENDING' },
	TRACING: { format: 'EN CURSO', name: 'TRACING' },
	QUOTED: { format: 'COTIZADO', name: 'QUOTED' },
	FINISHED: { format: 'CONCLUIDO', name: 'FINISHED' },
};

export {
	ServiceType,
	ContactMedium,
	ProductStatus,
	RequestStatus,
	RequestStatusList,
};
