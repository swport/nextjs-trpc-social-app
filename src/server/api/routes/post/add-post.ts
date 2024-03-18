import ApiResponse from "@/server/utils/api-response";
import { protectedProcedure } from "../../trpc";
import { PrismaClient, Post } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import type { TPost } from "@/server/types";
import { z } from "zod";
import { addPostFormSchema } from "@/utils/form-schemas";
import { rescue } from "@/server/utils";
import { setTypesafeKeyValToObject } from "@/utils/functions";

const prisma = new PrismaClient();

export const addPostProtectedProcedure = protectedProcedure
	// .input(z.object(addPostFormSchema))
	.input(
		z.object({
			title: z.string().nonempty().min(3),
			image: z.string(),
		})
	)
	.mutation(async ({ input, ctx: { session } }) => {
		const userId = session.user.id;

		const { title, image } = input;

		let post!: TPost;

		const error = await rescue(async function () {
			const dbPost = await prisma.post.create({
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
							userId,
						},
					},
					_count: {
						select: { LikedBy: true },
					},
				},
				data: {
					file_path: image,
					file_type: "image",
					content: title.trim(),
					userId,
					likesCount: 0,
					createdAt: new Date(),
					updatedAt: new Date(),
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
		}, "add-post");

		if (error || !post) {
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "An unexpected error occurred, please try again later.",
			});
		}

		return ApiResponse.success<TPost>("Post added", post);
	});
