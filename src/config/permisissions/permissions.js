export const ROLES = {
	admin: 'ADMIN',
	desk: 'DESK',
	marketing: 'MARKETING',
	salesManager: 'SALESMANAGER',
	salesOperator: 'SALESOPERATOR',
};

export const SCOPES = {
	total: 'TOTAL',
	view: 'view',
	create: 'create',
	edit: 'edit',
	delete: 'delete',
};

export const SCOPESREQUEST = {
	interact: 'interact',
	changeStatus: 'changeStatus',
	selectOperator: 'selectOperator',
};

export const REQUESTDETAILSSCOPES = {
	interact: 'interact',
	edit: 'edit',
	writeOperator: 'writeOperator',
	writeManager: 'writeManager',
};

export const REQUESTCREATESCOPES = {
	create: 'create',
};

export const PERMISSIONS = {
	[ROLES.admin]: [SCOPES.total],
	[ROLES.desk]: [REQUESTCREATESCOPES.create],
	[ROLES.salesOperator]: [SCOPESREQUEST.interact],
};
