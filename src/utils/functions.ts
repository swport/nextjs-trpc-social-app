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

export const titleToSlug = (str: string) => {
	str = str.replace(/^\s+|\s+$/g, "");
	str = str.toLowerCase();

	const from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
	const to = "aaaaeeeeiiiioooouuuunc------";
	for (let i = 0, l = from.length; i < l; i++) {
		str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
	}

	str = str
		.replace(/[^a-z0-9 -]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-");

	return str.substring(0, 75);
};
