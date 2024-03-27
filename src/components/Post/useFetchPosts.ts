import React from "react";
import { trpc } from "@/utils/trpc";
import { POSTS_PER_PAGE } from "@/utils/constants";

const useFetchPosts = () => {
	return trpc.post.fetchAll.useInfiniteQuery(
		{
			limit: POSTS_PER_PAGE,
		},
		{
			getNextPageParam: (lastPage) => {
				if (lastPage && lastPage.nextCursor) {
					return lastPage.nextCursor;
				}
				return null;
			},
		}
	);
};

export default useFetchPosts;
