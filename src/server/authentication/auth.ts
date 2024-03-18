import CredentialsProvider from "next-auth/providers/credentials";
import type { GetServerSidePropsContext } from "next";
import { getServerSession, type NextAuthOptions, type DefaultSession, type DefaultUser } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import type { GoogleProfile } from "next-auth/providers/google";
import { env } from "@/env.mjs";
import prismaAdapter from "../prisma-adapter";
import VerifyOtpUpdateUser from "./verify-otp";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
	interface Session extends DefaultSession {
		user: {
			id: number;
			emailVerified?: string;
			phone?: string;
			phoneVerifieid?: string;
			blockedTill?: Date;
			createdAt: Date;
			updatedAt: Date;
		} & DefaultSession["user"];
	}

	interface User extends DefaultUser {
		id: number;
		emailVerified?: string | null;
		phone?: string | null;
		phoneVerifieid?: string | null;
		blockedTill?: Date | null;
		otp?: string | null;
		createdAt?: Date; // these are not-null values in the db; but typescript complains authorize fn below
		updatedAt?: Date;
	}
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
	adapter: prismaAdapter,
	providers: [
		CredentialsProvider({
			id: "otp",
			name: "OTP Login",
			credentials: {
				username: {
					label: "Email",
					type: "text",
					placeholder: "Email",
					required: "true",
				},
				otp: { label: "Otp", type: "password", placeholder: "OTP", required: "true" },
			},
			async authorize(credentials) {
				if (credentials?.username && credentials?.otp) {
					return await VerifyOtpUpdateUser(credentials?.username, credentials?.otp);
				}
				return null;
			},
		}),
		GoogleProvider<GoogleProfile>({
			clientId: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
		}),
	],
	callbacks: {
		jwt({ token, user }) {
			if (user) {
				return { ...token, id: user.id };
			}
			return token;
		},
		session: ({ session, token, user }) => {
			return {
				...session,
				user: {
					...session.user,
					id: token.id,
				},
			};
		},
	},
	secret: env.NEXTAUTH_SECRET,
	session: {
		strategy: "jwt",
	},
	pages: {
		signIn: "/login",
	},
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
	req: GetServerSidePropsContext["req"];
	res: GetServerSidePropsContext["res"];
}) => {
	return getServerSession(ctx.req, ctx.res, authOptions);
};
