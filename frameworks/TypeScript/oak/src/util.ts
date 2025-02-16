export const rand = () => {
	return Math.ceil(Math.random() * 10000);
}

export const parseQueriesNumber = (q?: string | null) =>  Math.min(+q! || 1, 500);