import React from "react";
import { AppLayout, Post, Comments } from "@/components";
import { InferGetServerSidePropsType } from "next";
import { trpc } from "@/utils/trpc";

import { getServerSideProps } from "@/server/ssr/post";

const PostPage = (
	props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
	const { id } = props;
	const postQuery = trpc.post.getById.useQuery({ postId: Number(id) });

	if (postQuery.status !== "success") {
		return <>Loading...</>;
	}

	const { data } = postQuery;

	const post = data?.results;

	return (
		<AppLayout>
			<div className="mt-2">{post && <Post post={post} />}</div>
			<div className="mt-5">{post && <Comments postId={post.id} />}</div>
		</AppLayout>
	);
};

export { getServerSideProps };

export default PostPage;
