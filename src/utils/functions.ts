export const generate_otp = (length = 5) => {
	let otp = "";
	while (otp.length !== length) otp = Math.random().toFixed(5).substring(2);
	return otp;
};

export const setTypesafeKeyValToObject = <
	V extends T[K],
	T extends Record<string, any> = Record<string, any>,
	K extends string = string
>(
	obj: T,
	key: K,
	value: V
) => {
	obj[key] = value;
	return obj as T & { [P in K]: V };
};
