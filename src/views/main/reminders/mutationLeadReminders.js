import { gql } from '@apollo/client';

const CREATE_LEAD_REMINDER = gql`
	mutation LeadReminderCreate($leadReminder: CreateLeadReminderInput!) {
		leadReminderCreate(leadReminder: $leadReminder) {
			id
		}
	}
`;

export { CREATE_LEAD_REMINDER };
