import { ListItem, ListItemText, Typography, Stack } from '@mui/material';
import { pxToRem } from '@config/theme/functions';

const ListItemAux2 = ({ info, name, phoneNumber, email }) => {
	return (
		<ListItem disablePadding>
			<ListItemText
				sx={{
					display: 'flex',
					flexDirection: { xs: 'column', sm: 'row' },
				}}
				primary={
					<Typography
						fontSize={14}
						fontWeight={500}
						minWidth={{ xs: 'inherit', sm: pxToRem(170) }}
					>
						{info}
					</Typography>
				}
				secondary={
					<Stack>
						<Typography
							fontSize={14}
							fontWeight={400}
							color={'text.secondary'}
							mt={{ xs: pxToRem(6), sm: 6 }}
						>
							{name}
						</Typography>
						<Typography
							fontSize={14}
							fontWeight={400}
							color={'text.secondary'}
							mt={{ xs: pxToRem(6), sm: 6 }}
						>
							{phoneNumber}
						</Typography>
						<Typography
							fontSize={14}
							fontWeight={400}
							color={'text.secondary'}
							mt={{ xs: pxToRem(6), sm: 6 }}
						>
							{email}
						</Typography>
					</Stack>
				}
				disableTypography
			/>
		</ListItem>
	);
};

export default ListItemAux2;
