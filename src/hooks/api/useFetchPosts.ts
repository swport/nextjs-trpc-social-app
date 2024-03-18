import React from "react";
import { trpc } from "@/utils/trpc";
import { POSTS_PER_PAGE } from "@/utils/constants";

export const useFetchPosts = () => {
	const { data: posts, isLoading: postsLoading } = trpc.fetch_posts.useQuery({
		skip: 0,
		take: POSTS_PER_PAGE,
	});

	return { posts, postsLoading };
};
