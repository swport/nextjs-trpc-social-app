type TRescueCallable = () => void | Promise<void>;

export const rescue = async (
	callable: TRescueCallable,
	log_title = "root"
): Promise<undefined | string> => {
	let error: string | undefined;

	try {
		await callable();
	} catch (e) {
		if (typeof e === "string") {
			error = e;
		} else if (e instanceof Error) {
			error = e.message;
		} else {
			error = "Something went wrong";
		}
	}

	// TODO: logging

	return error;
};
