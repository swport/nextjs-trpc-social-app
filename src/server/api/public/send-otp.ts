import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { publicProcedure } from "@/server/api/trpc";
import { rescue } from "@/server/utils";
import { generate_otp } from "@/utils/functions";
import prismaAdapter from "@/server/prisma-adapter";
import { emailProviderRegex } from "@/utils/validations/email";
import { OTP_INPUT_LENGTH } from "@/utils/constants";

export const sendOtpProcedure = publicProcedure
	.input(
		z.object({
			username: z
				.string()
				.regex(
					emailProviderRegex,
					"Invalid email address. Please try with a valid email address."
				),
		})
	)
	.mutation(async ({ input }) => {
		const otp = generate_otp(OTP_INPUT_LENGTH);

		const error = await rescue(async function () {
			let user = await prismaAdapter.getUserByEmail(input.username);

			if (user) {
				user.otp = otp;
				await prismaAdapter.updateUser(user);
			} else {
				user = await prismaAdapter.createUser({
					otp,
					email: input.username,
					emailVerified: null,
					createdAt: new Date(),
					updatedAt: new Date(),
				});
			}
		}, "send_otp");

		if (error) {
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "An unexpected error occurred, please try again later.",
			});
		}

		return "OTP sent successfully";
	});
