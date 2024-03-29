import { formatDistanceToNow, format } from "date-fns";

export const formatRelativeDate = (comparisonDate: Date) => {
	return formatDistanceToNow(comparisonDate, { addSuffix: true });
};

export const formatDate = (date: Date) => {
	return format(date, "do MMMM, yyyy hh:mm a");
};
