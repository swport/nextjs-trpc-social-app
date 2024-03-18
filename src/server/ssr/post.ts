import { GetServerSidePropsContext } from "next";
import { createServerSideHelpers } from "@trpc/react-query/server";
import superjson from "superjson";
import { appRouter } from "../api/root";
import { createInnerTRPCContext } from "../api/trpc";
import { getServerAuthSession } from "../authentication/auth";

export const getServerSideProps = async (
	context: GetServerSidePropsContext<{ id: string }>
) => {
	const session = await getServerAuthSession(context);

	const serverHelper = createServerSideHelpers({
		router: appRouter,
		// @ts-ignore
		ctx: createInnerTRPCContext({ session: session }),
		transformer: superjson,
	});

	const id = context.params?.id as string;

	await serverHelper.post.getById.prefetch({ postId: Number(id) });

	return {
		props: {
			trpcState: serverHelper.dehydrate(),
			id,
		},
	};
};

export type postSSRType = typeof getServerSideProps;
