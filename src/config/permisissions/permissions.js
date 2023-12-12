export const ROLES = {
	admin: 'ADMIN',
	desk: 'DESK',
	marketing: 'MARKETING',
	salesManager: 'SALESMANAGER',
	salesOperator: 'SALESOPERATOR',
};

export const SCOPES_GENERAL = {
	total: 'TOTAL',
	view: 'view',
	create: 'create',
	edit: 'edit',
	delete: 'delete',
};

export const SCOPES_REQUEST = {
	total: 'total',
	create: 'create',
	filterOperator: 'filterOperator',
	export: 'export',
};

export const SCOPES_REQUEST_DETAILS = {
	total: 'total',
	interact: 'interact',
	edit: 'edit',
	commentOperator: 'commentOperator',
	commentManager: 'commentManager',
};

export const PERMISSIONS = {
	[ROLES.admin]: [SCOPES_GENERAL.total],
	[ROLES.desk]: [SCOPES_REQUEST.total, SCOPES_REQUEST.export],
	[ROLES.salesManager]: [
		SCOPES_REQUEST.total,
		SCOPES_REQUEST.filterOperator,
		SCOPES_REQUEST_DETAILS.total,
		SCOPES_REQUEST_DETAILS.interact,
		SCOPES_REQUEST_DETAILS.edit,
		SCOPES_REQUEST_DETAILS.commentManager,
	],
	[ROLES.salesOperator]: [
		SCOPES_REQUEST_DETAILS.interact,
		SCOPES_REQUEST_DETAILS.edit,
		SCOPES_REQUEST_DETAILS.commentOperator,
	],
};
