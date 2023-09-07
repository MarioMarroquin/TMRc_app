import PropTypes from 'prop-types';
import {
	Avatar,
	Box,
	Button,
	Card,
	CardContent,
	CardHeader,
	IconButton,
	Stack,
	Typography,
} from '@mui/material';
import { Email, NoAccounts, Phone, WhatsApp } from '@mui/icons-material';
import { grey } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';

const ClientCard = ({ client }) => {
	const navigate = useNavigate();

	const goToDetails = (data) => {
		const id = data.id;
		navigate(id);
	};

	return (
		<Card sx={{ height: '100%' }}>
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

						<Button
							variant={'text'}
							onClick={() => goToDetails(client)}
							disabled
						>
							Ver detalles
						</Button>
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

ClientCard.propTypes = {
	client: PropTypes.object,
};

export default ClientCard;
