import PropTypes from 'prop-types';
import React, { Fragment, useState } from 'react';
import {
	Box,
	Button,
	Grid,
	List,
	ListItem,
	ListItemText,
	MenuItem,
	Stack,
	Typography,
} from '@mui/material';
import {
	ArrowBack,
	Circle,
	ContentPasteSearch,
	FiberManualRecord,
	KeyboardArrowDown,
	Logout,
	RequestQuote,
	Sync,
} from '@mui/icons-material';
import { pxToRem } from '@config/theme/functions';
import toast from 'react-hot-toast';
import CustomMenu from '@components/customMenu';
import useLeadDetail from '@views/main/leads/leadDetail/useLeadDetail';
import { RequestStatus, RequestStatusList } from '@utils/enums';
import PermissionsGate from '@components/PermissionsGate';
import {
	SCOPES_GENERAL,
	SCOPES_REQUEST_DETAILS,
} from '@config/permisissions/permissions';
import LeadStatusDot from '@views/main/leads/components/LeadStatusDot';
import { format } from 'date-fns';

const LeadDetail = (props) => {
	const { lead, userId } = useLeadDetail();
	const [anchorMenu, setAnchorMenu] = useState(null);
	const handleOpenMenu = (event) => {
		setAnchorMenu(event.currentTarget);
	};

	const handleCloseMenu = () => {
		setAnchorMenu(null);
	};

	return (
		<Fragment>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'row',
					px: pxToRem(8),
				}}
			>
				<Button
					variant={'text'}
					startIcon={<ArrowBack />}
					onClick={() => {
						// navigate('/requests');
					}}
				>
					regresar
				</Button>

				<Button
					sx={{ ml: 'auto' }}
					color={'secondary'}
					onClick={() => {
						// const toastId = toast.loading('Actualizando...');
						// refetch().then((res) => {
						// 	console.log('Actualizado', res);
						//
						// 	toast.success('Actualizado', { id: toastId });
						// });
					}}
				>
					<Sync />
				</Button>

				<Button
					sx={{ ml: pxToRem(16) }}
					disableElevation
					onClick={handleOpenMenu}
					endIcon={<KeyboardArrowDown />}
				>
					Acciones
				</Button>
				<CustomMenu
					anchorEl={anchorMenu}
					open={Boolean(anchorMenu)}
					onClose={handleCloseMenu}
				>
					<PermissionsGate
						scopes={[SCOPES_GENERAL.total, SCOPES_REQUEST_DETAILS.interact]}
					>
						<MenuItem
							key={3}
							disableRipple
							disabled={
								lead?.requestStatus !== RequestStatusList.PENDING.name ||
								lead?.isSale !== null
							}
							onClick={() => {
								// changeRequestStatus('TRACING');
							}}
						>
							<LeadStatusDot status={'TRACING'} />
							En curso
						</MenuItem>
						<MenuItem
							key={3}
							disableRipple
							disabled={
								lead?.requestStatus !== RequestStatusList.TRACING.name ||
								lead?.isSale !== null
							}
							onClick={() => {
								// changeRequestStatus('QUOTED');
							}}
						>
							<LeadStatusDot status={'QUOTED'} />
							Cotizado
						</MenuItem>
					</PermissionsGate>
					<MenuItem key={1} disableRipple>
						<LeadStatusDot status={'FINISHED'} isSale={true} />
						Completar
					</MenuItem>
					<MenuItem key={2} disableRipple>
						<LeadStatusDot status={'FINISHED'} />
						No concretado
					</MenuItem>
				</CustomMenu>
			</Box>

			<Grid container direction={'row'}>
				<Grid item xs={12} sm={7}>
					<Box
						sx={{
							width: '100%',
							display: 'flex',
							flexDirection: 'row',
							borderRadius: 1,
							borderLeft: `8px solid #000`,
							p: pxToRem(8),
						}}
					>
						<Stack justifyContent={'space-between'}>
							<Typography># {lead?.shortId}</Typography>
							<Stack direction={'row'} alignItems={'center'} mt={pxToRem(4)}>
								<LeadStatusDot
									status={lead?.requestStatus}
									isSale={lead?.isSale}
								/>
								<Typography variant={'primaryBold14'} ml={pxToRem(4)}>
									{lead?.requestStatus
										? RequestStatus[lead?.requestStatus]
										: 'N/D'}
								</Typography>
							</Stack>
						</Stack>

						{userId !== lead?.assignedUser.id && ( // check if same user
							<Stack ml={'auto'}>
								<Typography>Asignado:</Typography>
								<Typography ml={'auto'}>
									{lead?.assignedUser.firstName} {lead?.assignedUser.lastName}
								</Typography>
							</Stack>
						)}
					</Box>

					<Box>
						<List>
							<ListItem>
								<ListItemText
									sx={{
										display: 'flex',
										flexDirection: { xs: 'column', sm: 'row' },
									}}
									primary={<Typography>Fecha</Typography>}
									secondary={
										<Typography>
											{format(
												new Date(lead?.requestDate ?? new Date()),
												'dd/MM/yyyy - HH:mm'
											)}
										</Typography>
									}
									disableTypography
								/>
							</ListItem>

							<ListItem>
								<ListItemText
									sx={{
										display: 'flex',
										flexDirection: { xs: 'column', sm: 'row' },
									}}
									primary={<Typography>ID</Typography>}
									secondary={<Typography></Typography>}
									disableTypography
								/>
							</ListItem>
						</List>
					</Box>
				</Grid>

				<Grid item xs={12} sm={5}></Grid>
			</Grid>
		</Fragment>
	);
};

LeadDetail.propTypes = {};

export default LeadDetail;
