import { createTRPCRouter } from "@/server/api/trpc";
import { addCommentProtectedProcedure } from "./add-comment";
import { listCommentProtectedProcedure } from "./list-comments";
import { removeCommentProtectedProcedure } from "./remove-comment";

export const commentRouter = createTRPCRouter({
	add: addCommentProtectedProcedure,
	delete: removeCommentProtectedProcedure,
	list: listCommentProtectedProcedure,
});
