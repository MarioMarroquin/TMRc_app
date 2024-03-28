import PropTypes from 'prop-types';
import {
	Box,
	Card,
	CardContent,
	CardHeader,
	Grid,
	IconButton,
	Typography,
} from '@mui/material';
import { DocumentScanner, MoreVert } from '@mui/icons-material';
import { pxToRem } from '@config/theme/functions';
import { format } from 'date-fns';
import React, { Fragment } from 'react';
import DialogDocumentUpload from '@views/main/leads/subviews/leadDetail/components/documents/DialogDocumentUpload';
import useDocuments from '@views/main/leads/subviews/leadDetail/components/documents/useDocuments';

const Documents = ({ documents, open, leadId, refetch, onClose }) => {
	const documentsHook = useDocuments();

	return (
		<Fragment>
			<Grid container>
				{documents.map((document, index) => (
					<Grid key={index} item xs={6} lg={4} xl={3}>
						<Card sx={{ m: 8 }}>
							<CardHeader
								sx={{ p: `${pxToRem(8)}` }}
								action={
									<IconButton disabled>
										<MoreVert />
									</IconButton>
								}
								title={document.title}
								subheader={`${
									Number(Number(document.fileSize).toFixed(2)) || 0
								} MB`}
								titleTypographyProps={{
									fontSize: 14,
									fontWeight: 500,
								}}
								subheaderTypographyProps={{
									fontSize: 11,
									fontWeight: 400,
								}}
							/>
							<CardContent
								sx={{
									p: 0,
									'&:last-child': {
										pb: 0,
									},
								}}
							>
								<IconButton
									onDoubleClick={() => {
										window.open(document.fileURL);
									}}
									sx={{
										borderRadius: pxToRem(4),
										width: '100%',
										height: pxToRem(112),
										display: 'flex',
										justifyContent: 'center',
										bgcolor: '#fabb1815',
									}}
								>
									<DocumentScanner />
								</IconButton>
							</CardContent>
							<Box sx={{ p: `${pxToRem(8)}` }}>
								<Typography fontSize={12} fontWeight={400} align={'right'}>
									{format(new Date(document.createdAt), 'dd/MM/yyyy')}
								</Typography>
							</Box>
						</Card>
					</Grid>
				))}
			</Grid>

			<DialogDocumentUpload
				onClose={onClose}
				open={open}
				leadId={leadId}
				refetch={refetch}
				documentFile={documentsHook.document.documentFile}
				value={documentsHook.document.documentTitle}
				onChange={documentsHook.document.documentInputChange}
				documentRef={documentsHook.document.documentRef}
				onChangeInput={documentsHook.document.documentSelection}
				loading={documentsHook.loading}
				inputClick={documentsHook.document.inputClick}
				onCreate={documentsHook.document.uploadDocument}
				uploadProgress={documentsHook.uploadProgress}
			/>
		</Fragment>
	);
};

Documents.propTypes = {
	documents: PropTypes.array,
};

export default Documents;
