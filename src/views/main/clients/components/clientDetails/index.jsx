import PropTypes from 'prop-types';
import {
	Avatar,
	Box,
	Card,
	CardContent,
	CardHeader,
	IconButton,
	Stack,
	Typography,
} from '@mui/material';
import { Fragment } from 'react';
import { Email, NoAccounts, Phone, WhatsApp } from '@mui/icons-material';
import { grey } from '@mui/material/colors';

const ClientDetails = ({ client }) => {
	return (
		<Card>
			<CardHeader title='Detalles' titleTypographyProps={{ align: 'center' }} />
			<CardContent>
				{client ? (
					<Stack alignItems={'center'} spacing={2}>
						<Avatar sx={{ width: 68, height: 68 }} />
						<Typography>{client.firstName}</Typography>
						<Typography>{client.phoneNumbers}</Typography>

						<Box>
							<IconButton color={'secondary'}>
								<Phone />
							</IconButton>
							<IconButton sx={{ color: 'green' }}>
								<WhatsApp />
							</IconButton>
							<IconButton color={'secondary'}>
								<Email />
							</IconButton>
						</Box>
					</Stack>
				) : (
					<Stack alignItems={'center'}>
						<NoAccounts sx={{ width: 68, height: 68, color: grey[500] }} />
						<Typography color={'secondary'}>No hay selección</Typography>
					</Stack>
				)}
			</CardContent>
		</Card>
	);
};

ClientDetails.propTypes = {
	client: PropTypes.object,
};

export default ClientDetails;
