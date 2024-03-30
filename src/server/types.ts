import type { typeToFlattenedError } from "zod";
import type { RuntimeConfig } from "@trpc/server/src/core/internals/config";
import type { TRPC_ERROR_CODE_NUMBER } from "@trpc/server/src/rpc";
import type { TRPCErrorShape } from "@trpc/server/src/rpc/envelopes";

import type { Comment, Post, User } from "@prisma/client";

// Utility type to replace the return type of a function
export type ReplaceReturnType<T extends (...a: any) => any, TNewReturn> = (
	...a: Parameters<T>
) => TNewReturn;

// Flattened zod error
export type FlattenedZodError = typeToFlattenedError<any, string>;

export type CustomErrorShape = TRPCErrorShape<
	TRPC_ERROR_CODE_NUMBER,
	Record<string, unknown> & { inputValidationError: FlattenedZodError | null }
>;

// This type extends the errorFormatter property with the custom error shape
export type CustomErrorFormatter = ReplaceReturnType<
	RuntimeConfig<any>["errorFormatter"],
	CustomErrorShape
>;

export type TPubUser = {
	id: User["id"];
	name: string | null;
};

export type TPost = {
	id: Post["id"];
	content: Post["content"];
	slug: Post["slug"];
	file_path: Post["file_path"];
	file_type: Post["file_type"];
	likes: number;
	likedBySelf: boolean;
	createdAt: Date;
	LikedBy: {
		userId: Post["userId"];
	}[];
	User: TPubUser | null;
	_count: {
		LikedBy: number;
	};
};

export type TComment = {
	id: Comment["id"];
	content: Comment["content"] | null;
	User: TPubUser | null;
	createdAt: Date;
};
