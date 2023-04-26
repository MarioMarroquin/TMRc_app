import { gql } from '@apollo/client';

const CREATE_COMPANY = gql`
	mutation CreateCompany($company: CreateCompanyInput!) {
		createCompany(company: $company) {
			id
		}
	}
`;

export { CREATE_COMPANY };
