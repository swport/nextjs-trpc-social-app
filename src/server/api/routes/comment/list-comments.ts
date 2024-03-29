import { type TComment } from "@/server/types";
import { protectedProcedure, publicProcedure } from "../../trpc";
import { z } from "zod";
import { rescue } from "@/server/utils";
import { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";

const prisma = new PrismaClient();

type ResponseType = {
	nextCursor: number | null | undefined;
	data: TComment[];
};

export const listCommentProtectedProcedure = publicProcedure
	.input(
		z.object({
			postId: z.number(),
			limit: z.number().min(1).max(100).nullish(),
			cursor: z.number().nullish(),
		})
	)
	.query(async ({ input, ctx: { session } }) => {
		// it should hit cache first for the incoming page no
		// if cache miss; find in the database and cache the result.

		const limit = input.limit ?? 50;
		const { postId, cursor } = input;

		let authUserId = 0;
		if (session && session?.user) {
			authUserId = session.user.id;
		}

		const data = await prisma.comment.findMany({
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
				content: true,
				createdAt: true,
			},
			where: {
				postId,
			},
		});

		let nextCursor: typeof cursor | undefined = undefined;

		if (data.length > limit) {
			const nextItem = data.pop();
			nextCursor = nextItem!.id;
		}

		return {
			nextCursor,
			data,
		};
	});
