import React from "react";
import { trpc } from "@/utils/trpc";

// for temporary purpose - just to generate an image
import { faker } from "@faker-js/faker";

const useAddPost = () => {
	const addPostMutation = trpc.post.add.useMutation();
	const utils = trpc.useContext();

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

	return { error, isPostAdded, loading: isLoading, addPost };
};

export default useAddPost;
