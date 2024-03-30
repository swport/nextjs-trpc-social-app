import React from "react";
import { AppLayout, Post, Comments } from "@/components";
import { type InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { trpc } from "@/utils/trpc";
import { getServerSideProps } from "@/server/ssr/post";

function getTitle(title: string) {
	return title.substring(0, 35) + (title.length > 35 ? "..." : "");
}

const PostPage = (
	props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
	const { id } = props;
	const postQuery = trpc.post.getById.useQuery({ postId: Number(id) });

	if (postQuery.status !== "success") {
		return <>Loading...</>;
	}

	const { data: post } = postQuery;

	return (
		<>
			<Head>
				<title>{`${getTitle(post.content)} | ${post.User?.name}`}</title>
			</Head>
			<AppLayout>
				<div className="mt-2">{post && <Post post={post} />}</div>
				<div className="mt-5">{post && <Comments postId={post.id} />}</div>
			</AppLayout>
		</>
	);
};

export { getServerSideProps };

export default PostPage;
