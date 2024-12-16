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
	Tooltip,
	Typography,
	useTheme,
} from '@mui/material';
import { Clear } from '@mui/icons-material';
import React, { Fragment } from 'react';
import PermissionsGate from '@components/PermissionsGate';
import {
	SCOPES_GENERAL,
	SCOPES_REQUEST,
} from '@config/permisissions/permissions';
import exportExcelReport from '@views/main/requests/exportExcelReport';
import exportExcelTable from '@views/main/requests/exportExcelTable';

const DrawerLeadsMenu = ({
	allLeads,
	pendingLeads,
	open,
	onClose,
	exportToExcel,
	exportToExcelDefault,
}) => {
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
					<Typography fontSize={16} fontWeight={700}>
						Opciones
					</Typography>
					<IconButton sx={{ ml: 'auto' }} onClick={onClose}>
						<Clear />
					</IconButton>
				</Stack>

				<Typography fontSize={14} fontWeight={600} mx={12}>
					Filtros
				</Typography>

				<Divider sx={{ mx: 12, my: 4 }} />

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

				<Typography fontSize={14} fontWeight={600} mx={12} mt={32}>
					Exportar
				</Typography>

				<Divider sx={{ mx: 12, my: 4 }} />

				<Typography
					color={'text.secondary'}
					fontSize={11}
					fontWeight={500}
					mx={12}
					mb={8}
				>
					Exporta los datos de la tabla a un archivo de Excel.
				</Typography>

				<Stack spacing={8} mx={24} mt={16}>
					<Button
						onClick={() => {
							exportToExcel('All');
						}}
					>
						Exportar todo
					</Button>

					{/* <PermissionsGate scopes={[SCOPES_REQUEST.export]}> */}
					<Button
						onClick={() => {
							exportToExcel('AfterFilter');
						}}
					>
						Exportar con filtro
					</Button>
					{/* </PermissionsGate> */}
					<Button
						onClick={() => {
							exportToExcel('AfterFilterAndSort');
						}}
					>
						Exportar con filtro y orden
					</Button>
				</Stack>

				<Typography fontSize={14} fontWeight={600} mx={12} mt={32}>
					Exportar con formato
				</Typography>

				<Divider sx={{ mx: 12, my: 4 }} />

				<Typography
					color={'text.secondary'}
					fontSize={11}
					fontWeight={500}
					mx={12}
					mb={8}
				>
					Exporta los datos de la tabla a un archivo de Excel con un formato
					predeterminado.
				</Typography>

				<Stack spacing={8} mx={24} mt={16}>
					<Button
						onClick={() => {
							exportToExcelDefault();
						}}
					>
						Exportar
					</Button>
				</Stack>
			</Box>
		</Drawer>
	);
};

DrawerLeadsMenu.propTypes = {};

export default DrawerLeadsMenu;
