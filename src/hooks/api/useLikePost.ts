import { trpc } from "@/utils/trpc";

export const useLikePost = () => {
	const utils = trpc.useContext();
	const { mutate: likePost } = trpc.post.like.useMutation({
		// onMutate: async () => {
		// 	// optimistic update
		// 	await utils.fetch_posts.cancel();
		// 	const previousPosts = utils.fetch_posts.getData();
		//     utils.fetch_posts.in
		// 	utils.fetch_posts.setData((oldPosts) => [...oldPosts]);
		// },
	});

	return likePost;
};
