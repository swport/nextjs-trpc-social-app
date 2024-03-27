import { type TComment } from "@/server/types";
import { protectedProcedure } from "../../trpc";
import { z } from "zod";
import { rescue } from "@/server/utils";
import { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";

const prisma = new PrismaClient();

export const addCommentProtectedProcedure = protectedProcedure
	.input(
		z.object({
			postId: z.number(),
			content: z.string().nonempty().min(3),
		})
	)
	.mutation(async ({ input, ctx: { session } }) => {
		const userId = session.user.id;
		const { postId, content } = input;

		let comment!: TComment;

		const error = await rescue(async () => {
			comment = await prisma.comment.create({
				select: {
					User: {
						select: {
							id: true,
							name: true,
						},
					},
					id: true,
					content: true,
				},
				data: {
					postId,
					userId,
					content,
				},
			});
		}, "add-comment");

		if (error) {
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "An unexpected error occurred, please try again later.",
			});
		}

		return comment;
	});
