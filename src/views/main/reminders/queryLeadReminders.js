import { gql } from '@apollo/client';

const GET_LEAD_REMINDERS = gql`
	query LeadRemindersByToken {
		leadRemindersByToken {
			results {
				id
				active
				message
				notificationDate
				daysHope
				lead {
					id
				}
				createdAt
				createdBy {
					id
					firstName
					lastName
					username
				}
			}
		}
	}
`;

export { GET_LEAD_REMINDERS };
