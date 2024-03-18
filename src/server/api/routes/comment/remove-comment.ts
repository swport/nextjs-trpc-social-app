import { TComment } from "@/server/types";
import { protectedProcedure } from "../../trpc";
import { z } from "zod";
import { rescue } from "@/server/utils";
import { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import ApiResponse from "@/server/utils/api-response";

const prisma = new PrismaClient();

export const removeCommentProtectedProcedure = protectedProcedure
	.input(
		z.object({
			commentId: z.number(),
		})
	)
	.mutation(async ({ input, ctx: { session } }) => {
		const userId = session.user.id;
		const { commentId } = input;

		const error = await rescue(async () => {
			await prisma.comment.deleteMany({
				where: {
					id: commentId,
					userId,
				},
			});
		}, "remove-comment");

		if (error) {
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "An unexpected error occurred, please try again later.",
			});
		}

		return ApiResponse.success("Comment removed");
	});
