import { gql } from '@apollo/client';

const GET_COMPANIES = gql`
	query Companies($params: QueryParams!) {
		companies(params: $params) {
			info {
				count
				next
				pages
				prev
			}
			results {
				id
				name
				phoneNumber
				website
				email
			}
		}
	}
`;

const CREATE_COMPANY = gql`
	mutation CreateCompany($company: CreateCompanyInput!) {
		createCompany(company: $company) {
			id
		}
	}
`;

const UPDATE_COMPANY = gql`
	mutation UpdateCompany($companyId: ID!, $company: UpdateCompanyInput) {
		updateCompany(companyId: $companyId, company: $company) {
			id
		}
	}
`;

export { GET_COMPANIES, UPDATE_COMPANY, CREATE_COMPANY };
