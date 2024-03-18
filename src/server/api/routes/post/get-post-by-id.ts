import { publicProcedure } from "@/server/api/trpc";
import ApiResponse from "@/server/utils/api-response";
import { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import type { TPost } from "@/server/types";
import { z } from "zod";
import { rescue } from "@/server/utils";
import { setTypesafeKeyValToObject } from "@/utils/functions";

const prisma = new PrismaClient();

export const getPostByIdPublicProcedure = publicProcedure
	.input(
		z.object({
			postId: z.number().gt(0),
		})
	)
	.query(async ({ input: { postId }, ctx: { session } }) => {
		let authUserId = 0;
		if (session && session?.user) {
			authUserId = session.user.id;
		}

		let post!: TPost;

		const error = await rescue(async function () {
			const dbPost = await prisma.post.findFirstOrThrow({
				select: {
					User: {
						select: {
							id: true,
							name: true,
						},
					},
					id: true,
					file_path: true,
					file_type: true,
					content: true,
					LikedBy: {
						select: {
							userId: true,
						},
						where: {
							userId: authUserId,
						},
					},
					_count: {
						select: { LikedBy: true },
					},
				},
				where: {
					id: postId,
				},
			});

			const postWithLikes = setTypesafeKeyValToObject(
				dbPost,
				"likes",
				dbPost._count.LikedBy
			);

			post = setTypesafeKeyValToObject(
				postWithLikes,
				"likedBySelf",
				Boolean(dbPost.LikedBy.length > 0)
			);
		}, "post-by-id");

		if (error || !post) {
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "An unexpected error occurred, please try again later.",
			});
		}

		return ApiResponse.success<TPost>("data", post);
	});
