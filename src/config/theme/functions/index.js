import chroma from 'chroma-js';

export const pxToRem = (pixels) => {
	return `${pixels / 16}rem`;
};

export const hexToRGB = (hex) => {
	return chroma(hex).rgb().join(', ');
};

export const hexToRGBA = (hex, opacity) => {
	return `rgba(${hexToRGB(hex)}, ${opacity})`;
};

export const createShadow = (
	offset = [],
	radius = [],
	color,
	opacity,
	inset = ''
) => {
	const [x, y] = offset;
	const [blur, spread] = radius;

	console.log(color, opacity);

	return `${inset} ${pxToRem(x)} ${pxToRem(y)} ${pxToRem(blur)} ${pxToRem(
		spread
	)} ${hexToRGBA(color, opacity)}`;
};
