// Soft UI Dashboard React Helper Functions

import colors from './colors';
import { createShadow } from '@config/theme/functions';

const { black, white } = colors;

const shadows = {
	xs: createShadow([0, 2], [9, -5], black.main, 0.15),
	sm: createShadow([0, 5], [10, 0], black.main, 0.12),
	md: `${createShadow([0, 4], [6, -1], black.main, 0.12)}, ${createShadow(
		[0, 2],
		[4, -1],
		black.main,
		0.07
	)}`,
	lg: `${createShadow([0, 8], [26, -4], black.main, 0.15)}, ${createShadow(
		[0, 8],
		[9, -5],
		black.main,
		0.06
	)}`,
	xl: createShadow([0, 23], [45, -11], black.main, 0.25),
	xxl: createShadow([0, 20], [30, 0], black.main, 0.05),
	inset: createShadow([0, 1], [2, 0], black.main, 0.075, 'inset'),
	navbarBoxShadow: `${createShadow(
		[0, 0],
		[1, 1],
		white.main,
		0.9,
		'inset'
	)}, ${createShadow([0, 20], [27, 0], black.main, 0.05)}`,
};

export default shadows;
