import { gql } from '@apollo/client';

const UPDATE_COMPANY = gql`
	mutation UpdateCompany($companyId: ID!, $company: UpdateCompanyInput) {
		updateCompany(companyId: $companyId, company: $company) {
			id
		}
	}
`;

export { UPDATE_COMPANY };
