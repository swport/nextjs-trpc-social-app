import { type typeToFlattenedError } from "zod";

type TResponse = {
	message: string;
	error: boolean;
	code: number;
};

type TResults<T> = T | null;

export type TSuccess<T> = TResponse & {
	results: TResults<T>;
};

export default class ApiResponse {
	public static success<T = null>(message = "ok", results: TResults<T> = null, statusCode = 200): TSuccess<T> {
		return {
			message,
			error: false,
			code: statusCode,
			results,
		};
	}

	public static error = (message: string, statusCode: number) => {
		const codes = [400, 401, 404, 403, 422, 500];

		if (!codes.includes(statusCode)) {
			statusCode = 500;
		}

		return {
			message,
			code: statusCode,
			error: true,
		};
	};

	public static validation = <T = string>(errors: typeToFlattenedError<T>) => {
		return {
			message: "Validation errors",
			error: true,
			code: 422,
			errors,
		};
	};
}
