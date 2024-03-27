import { publicProcedure } from "@/server/api/trpc";
import { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import type { TPubUser } from "@/server/types";
import { z } from "zod";
import { rescue } from "@/server/utils";

const prisma = new PrismaClient();

export const getProfileByIdPublicProcedure = publicProcedure
	.input(
		z.object({
			userId: z.number().gt(0),
		})
	)
	.query(async ({ input: { userId }, ctx: { session } }) => {
		let authUserId = 0;
		if (session && session?.user) {
			authUserId = session.user.id;
		}

		let profile!: TPubUser;

		const error = await rescue(async function () {
			profile = await prisma.user.findFirstOrThrow({
				select: {
					id: true,
					name: true,
				},
				where: {
					id: userId,
				},
			});
		}, "profile-by-id");

		if (error || !profile) {
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "An unexpected error occurred, please try again later.",
			});
		}

		return profile;
	});
