import ApiResponse from "@/server/utils/api-response";
import { protectedProcedure } from "../../trpc";
import { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { rescue } from "@/server/utils";

const prisma = new PrismaClient();

export const removePostProtectedProcedure = protectedProcedure
	.input(
		z.object({
			postId: z.number(),
		})
	)
	.mutation(async ({ input, ctx: { session } }) => {
		const userId = session.user.id;

		const { postId } = input;

		const error = await rescue(async function () {
			await prisma.post.deleteMany({
				where: {
					id: postId,
					userId,
				},
			});
		}, "delete-post");

		if (error) {
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "An unexpected error occurred, please try again later.",
			});
		}

		return ApiResponse.success("Post deleted");
	});
