import { GetServerSidePropsContext } from "next";
import { createServerSideHelpers } from "@trpc/react-query/server";
import superjson from "superjson";
import { appRouter } from "../api/root";

export const getServerSideProps = async (
	context: GetServerSidePropsContext<{ id: string }>
) => {
	const serverHelper = createServerSideHelpers({
		router: appRouter,
		// @ts-ignore -- not sure why should it complain here!!?
		ctx: {},
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
