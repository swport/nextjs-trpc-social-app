import React from "react";
import { trpc } from "@/utils/trpc";
import { getQueryKey } from "@trpc/react-query";
import { useQueryClient } from "@tanstack/react-query";

// for temporary purpose - just to generate an image
import { faker } from "@faker-js/faker";

const useAddPost = () => {
	const addPostMutation = trpc.post.add.useMutation();
	// const utils = trpc.useContext();

	// trpc.useContext utils doesn't work as expected, gives undefined for prevData
	// have to rely on native implementation
	const queryClient = useQueryClient();

	const [error, setError] = React.useState<string>();
	const [isLoading, setLoading] = React.useState(false);
	const [isPostAdded, setPostAdded] = React.useState(false);

	const addPost = (title: string) => {
		if (isLoading) return;

		// for temporary purpose - just to generate an image
		const image = faker.image.urlPicsumPhotos();

		setLoading(true);
		setError("");

		addPostMutation.mutate(
			{ title, image },
			{
				onSuccess: (post) => {
					// update cache when comment is added
					const postListKey = getQueryKey(
						trpc.post.fetchAll,
						{ limit: 15 },
						"infinite"
					);

					// TODO: update types
					const queryData =
						queryClient.getQueryData<Record<string, any>>(postListKey);

					if (queryData && typeof queryData["pages"] !== "undefined") {
						// prepend comment to the first page
						const firstPage = queryData["pages"][0] as { data: any[] };

						if (firstPage) {
							queryData["pages"][0]["data"] = [post, ...firstPage.data];

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

	return { error, isPostAdded, loading: isLoading, addPost };
};

export default useAddPost;
