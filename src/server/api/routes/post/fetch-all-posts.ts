import { publicProcedure } from "@/server/api/trpc";
import { PrismaClient } from "@prisma/client";
import type { TPost } from "@/server/types";
import { z } from "zod";
import { setTypesafeKeyValToObject } from "@/utils/functions";

const prisma = new PrismaClient();

type ResponseType = {
	nextCursor: number | null | undefined;
	data: TPost[];
};

export const fetchAllPostPublicProcedure = publicProcedure
	.input(
		z.object({
			limit: z.number().min(1).max(100).nullish(),
			cursor: z.number().nullish(),
		})
	)
	.query(async ({ input, ctx: { session } }) => {
		// it should hit cache first for the incoming page no
		// if cache miss; find in the database and cache the result.

		const limit = input.limit ?? 50;
		const { cursor } = input;

		let authUserId = 0;
		if (session && session?.user) {
			authUserId = session.user.id;
		}

		const results = await prisma.post.findMany({
			take: limit + 1,
			cursor: cursor ? { id: cursor } : undefined,
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
			orderBy: [
				{
					LikedBy: {
						_count: "desc",
					},
				},
				{
					updatedAt: "desc",
				},
			],
		});

		let nextCursor: typeof cursor | undefined = undefined;

		if (results.length > limit) {
			const nextItem = results.pop();
			nextCursor = nextItem ? nextItem.id : undefined;
		}

		const data = results.map((post) => {
			const p = setTypesafeKeyValToObject(post, "likes", post._count.LikedBy);
			return setTypesafeKeyValToObject(
				p,
				"likedBySelf",
				Boolean(post.LikedBy.length > 0)
			);
		});

		return {
			nextCursor,
			data,
		};
	});
