import {
	addDays,
	endOfDay,
	startOfDay,
	startOfMonth,
	endOfMonth,
	addMonths,
	startOfWeek,
	endOfWeek,
	isSameDay,
	differenceInCalendarDays,
} from 'date-fns';

const definitions = {
	startOfWeek: startOfWeek(new Date()),
	endOfWeek: endOfWeek(new Date()),
	startOfLastWeek: startOfWeek(addDays(new Date(), -7)),
	endOfLastWeek: endOfWeek(addDays(new Date(), -7)),
	startOfToday: startOfDay(new Date()),
	endOfToday: endOfDay(new Date()),
	startOfYesterday: startOfDay(addDays(new Date(), -1)),
	endOfYesterday: endOfDay(addDays(new Date(), -1)),
	startOfMonth: startOfMonth(new Date()),
	endOfMonth: endOfMonth(new Date()),
	startOfLastMonth: startOfMonth(addMonths(new Date(), -1)),
	endOfLastMonth: endOfMonth(addMonths(new Date(), -1)),
};

const staticRangeHandler = {
	range: {},
	isSelected(range) {
		const definedRange = this.range();
		return (
			isSameDay(range.startDate, definedRange.startDate) &&
			isSameDay(range.endDate, definedRange.endDate)
		);
	},
};

function createStaticRanges(ranges) {
	return ranges.map((range) => ({ ...staticRangeHandler, ...range }));
}

const spanishStaticRanges = createStaticRanges([
	{
		label: 'Hoy',
		range: () => ({
			startDate: definitions.startOfToday,
			endDate: definitions.endOfToday,
		}),
	},
	{
		label: 'Ayer',
		range: () => ({
			startDate: definitions.startOfYesterday,
			endDate: definitions.endOfYesterday,
		}),
	},

	{
		label: 'Esta semana',
		range: () => ({
			startDate: definitions.startOfWeek,
			endDate: definitions.endOfWeek,
		}),
	},
	{
		label: 'Semana pasada',
		range: () => ({
			startDate: definitions.startOfLastWeek,
			endDate: definitions.endOfLastWeek,
		}),
	},
	{
		label: 'Este mes',
		range: () => ({
			startDate: definitions.startOfMonth,
			endDate: definitions.endOfMonth,
		}),
	},
	{
		label: 'Mes pasado',
		range: () => ({
			startDate: definitions.startOfLastMonth,
			endDate: definitions.endOfLastMonth,
		}),
	},
]);

const spanishInputRanges = [
	{
		label: 'días para hoy',
		range(value) {
			return {
				startDate: addDays(
					definitions.startOfToday,
					(Math.max(Number(value), 1) - 1) * -1
				),
				endDate: definitions.endOfToday,
			};
		},
		getCurrentValue(range) {
			if (!isSameDay(range.endDate, definitions.endOfToday)) return '-';
			if (!range.startDate) return '∞';
			return (
				differenceInCalendarDays(definitions.endOfToday, range.startDate) + 1
			);
		},
	},
	{
		label: 'días después de hoy',
		range(value) {
			const today = new Date();
			return {
				startDate: today,
				endDate: addDays(today, Math.max(Number(value), 1) - 1),
			};
		},
		getCurrentValue(range) {
			if (!isSameDay(range.startDate, definitions.startOfToday)) return '-';
			if (!range.endDate) return '∞';
			return (
				differenceInCalendarDays(range.endDate, definitions.startOfToday) + 1
			);
		},
	},
];
export { spanishInputRanges, spanishStaticRanges };
