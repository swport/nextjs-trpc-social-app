import { createTRPCRouter } from "@/server/api/trpc";
import { likePostProtectedProcedure } from "./like-post";
import { addPostProtectedProcedure } from "./add-post";
import { getPostByIdPublicProcedure } from "./get-post-by-id";
import { removePostProtectedProcedure } from "./remove-post";

export const postRouter = createTRPCRouter({
	like: likePostProtectedProcedure,
	add: addPostProtectedProcedure,
	remove: removePostProtectedProcedure,
	getById: getPostByIdPublicProcedure,
});
