import React from "react";
import { trpc } from "@/utils/trpc";
import { getQueryKey } from "@trpc/react-query";
import { useQueryClient } from "@tanstack/react-query";

const useAddComment = () => {
	const addCommentMutation = trpc.comment.add.useMutation();

	// const utils = trpc.useContext();

	// trpc.useContext utils doesn't work as expected, gives undefined for prevData
	// have to rely on native implementation
	const queryClient = useQueryClient();

	const [error, setError] = React.useState<string>();
	const [isLoading, setLoading] = React.useState(false);
	const [isCommentAdded, setPostAdded] = React.useState(false);

	const addComment = (postId: number, content: string) => {
		if (isLoading) return;

		setLoading(true);
		setError("");

		addCommentMutation.mutate(
			{ postId, content },
			{
				onSuccess: (comment) => {
					// update cache when comment is added
					const postListKey = getQueryKey(
						trpc.comment.list,
						{ limit: 15, postId },
						"infinite"
					);

					// TODO: update types
					const queryData =
						queryClient.getQueryData<Record<string, any>>(postListKey);

					if (queryData && typeof queryData["pages"] !== "undefined") {
						// prepend comment to the first page
						const firstPage = queryData["pages"][0] as { data: any[] };

						if (firstPage) {
							queryData["pages"][0]["data"] = [comment, ...firstPage.data];

							queryClient.setQueryData(postListKey, {
								...queryData,
							});
						}
					}

					setPostAdded(true);
				},
				onError: () => {
					setError("Something went wrong at the server");
				},
				onSettled: () => {
					setLoading(false);
				},
			}
		);
	};

	return { error, isCommentAdded, loading: isLoading, addComment };
};

export default useAddComment;
