import PropTypes from 'prop-types';
import { pxToRem } from '@config/theme/functions';
import {
	Box,
	Button,
	Divider,
	Drawer,
	IconButton,
	Stack,
	Switch,
	Typography,
	useTheme,
} from '@mui/material';
import { Clear } from '@mui/icons-material';
import { Fragment } from 'react';
import PermissionsGate from '@components/PermissionsGate';
import {
	SCOPES_GENERAL,
	SCOPES_REQUEST,
} from '@config/permisissions/permissions';

const DrawerLeadsMenu = ({ allLeads, pendingLeads, open, onClose }) => {
	const theme = useTheme();

	return (
		<Drawer
			anchor={'right'}
			open={open}
			onClose={onClose}
			sx={{
				'& .MuiDrawer-paper': {
					width: 250,
					height: `calc(100vh - 32px)`,
					top: 16,
					borderTopLeftRadius: pxToRem(16),
					borderBottomLeftRadius: pxToRem(16),
					border: 'none',
					boxSizing: 'border-box',
				},
			}}
			slotProps={{
				backdrop: {
					sx: {
						bgcolor: `${theme.palette.background.default}85`,
						backdropFilter: `blur(8px)`,
					},
				},
			}}
		>
			<Box>
				<Stack direction={'row'} mt={8} mx={16} mb={8} alignItems={'center'}>
					<Typography fontSize={14} fontWeight={700}>
						Filtro global
					</Typography>
					<IconButton sx={{ ml: 'auto' }} onClick={onClose}>
						<Clear />
					</IconButton>
				</Stack>

				<Typography
					color={'text.secondary'}
					fontSize={11}
					fontWeight={500}
					mx={12}
					mb={8}
				>
					Estos filtros se aplican en la búsqueda global de solicitudes (leads).
				</Typography>

				<Stack flexDirection={'row'} alignItems={'center'} mx={16}>
					<Switch
						color={'secondary'}
						checked={pendingLeads.showPending}
						onChange={(event) => {
							pendingLeads.setShowPending(event.target.checked);
						}}
					/>
					<Typography fontSize={12} fontWeight={500} ml={8}>
						Solo pendientes
						{/* {!showPending ? 'Mostrar pendientes' : 'Pendientes'} */}
					</Typography>
				</Stack>

				<PermissionsGate
					scopes={[SCOPES_GENERAL.total, SCOPES_REQUEST.filterOperator]}
				>
					<Stack flexDirection={'row'} alignItems={'center'} mx={16}>
						<Switch
							color={'secondary'}
							checked={!allLeads.showAll}
							onChange={(event) => {
								allLeads.setShowAll(!event.target.checked);
							}}
						/>
						<Typography fontSize={12} fontWeight={500} ml={8}>
							Solo mis asignadas
							{/* {showAll ? 'Mostrar mis asignadas' : 'Mis asignadas'} */}
						</Typography>
					</Stack>
				</PermissionsGate>
			</Box>
		</Drawer>
	);
};

DrawerLeadsMenu.propTypes = {};

export default DrawerLeadsMenu;
