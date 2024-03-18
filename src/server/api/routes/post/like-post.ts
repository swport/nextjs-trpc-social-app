import ApiResponse from "@/server/utils/api-response";
import { protectedProcedure } from "../../trpc";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

export const likePostProtectedProcedure = protectedProcedure
	.input(
		z.object({
			post_id: z.number(),
		})
	)
	.mutation(async ({ input, ctx: { session } }) => {
		const userId = session.user.id;

		// TODO: store posts likes in a caching solution; and when the cache reaches a certain level;
		//    update database and empty caching for likes

		const existingLike = await prisma.userLikedPost.findUnique({
			where: {
				userId_postId: {
					userId,
					postId: input.post_id,
				},
			},
		});

		if (existingLike) {
			await prisma.userLikedPost.delete({
				where: {
					userId_postId: {
						userId,
						postId: input.post_id,
					},
				},
			});
		} else {
			await prisma.userLikedPost.create({
				data: {
					postId: input.post_id,
					userId,
				},
			});
		}

		return ApiResponse.success("Updated");
	});
