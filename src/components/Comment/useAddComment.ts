import React from "react";
import { trpc } from "@/utils/trpc";

const useAddComment = () => {
	const addCommentMutation = trpc.comment.add.useMutation();

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
				onSuccess: ({ results: post }) => {
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
