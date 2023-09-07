import { format, getDate, getDay, getMonth, getYear } from 'date-fns';

const formatToFolio = (params) => {
	const year = getYear(new Date(params));
	const month = getMonth(new Date(params)) + 1;
	const day = getDate(new Date(params));

	const aux = format(new Date(params), 'HHmm');
	return `${year}${month}${day}${aux}`;
};

export default formatToFolio;
