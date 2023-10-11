export const ROLES = {
	admin: 'ADMIN',
	desk: 'DESK',
	marketing: 'MARKETING',
	salesManager: 'SALESMANAGER',
	salesOperator: 'SALESOPERATOR',
};

export const SCOPES = {
	view: 'view',
	create: 'create',
	edit: 'edit',
	delete: 'delete',
};

export const SCOPESREQUEST = {
	interact: 'interact',
};

export const PERMISSIONS = {
	[ROLES.admin]: [SCOPES.view, SCOPES.create, SCOPES.edit, SCOPES.delete],
	[ROLES.desk]: [SCOPES.view, SCOPES.create],
	[ROLES.salesOperator]: [SCOPESREQUEST.interact],
};
