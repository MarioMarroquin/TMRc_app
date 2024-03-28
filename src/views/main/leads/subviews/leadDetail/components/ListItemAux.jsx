import { ListItem, ListItemText, Typography } from '@mui/material';
import { pxToRem } from '@config/theme/functions';
import React from 'react';

const ListItemAux = ({ name, text }) => {
	if (!text) {
		return <></>;
	} else {
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
							{name}
						</Typography>
					}
					secondary={
						<Typography
							fontSize={14}
							fontWeight={400}
							color={'text.secondary'}
							mt={{ xs: pxToRem(6), sm: 0 }}
						>
							{text}
						</Typography>
					}
					disableTypography
				/>
			</ListItem>
		);
	}
};

export default ListItemAux;
