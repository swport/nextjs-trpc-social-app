import { createTRPCRouter } from "@/server/api/trpc";
import { sendOtpProcedure } from "./public/send-otp";
import { postRouter } from "./routes/post/post";
import { commentRouter } from "./routes/comment/comment";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
	send_otp: sendOtpProcedure,
	post: postRouter,
	comment: commentRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
