import React from "react";
import { trpc } from "@/utils/trpc";
import { POSTS_PER_PAGE } from "@/utils/constants";

const useFetchPosts = () => {
	return trpc.fetch_posts.useInfiniteQuery(
		{
			limit: POSTS_PER_PAGE,
		},
		{
			getNextPageParam: (lastPage) => {
				if (lastPage && lastPage.results?.nextCursor) {
					return lastPage.results.nextCursor;
				}
				return null;
			},
		}
	);
};

export default useFetchPosts;
