import React from "react";
import { trpc } from "@/utils/trpc";
import { BsHandThumbsUp, BsHandThumbsUpFill, BsWhatsapp } from "react-icons/bs";
import { FaRegCommentDots } from "react-icons/fa";
import Link from "../UI/Link";
import { useAtom } from "jotai";
import { offcAtom } from "@/store/offcanvas";

type TPostActions = {
	id: number;
	likes: number;
	likedBySelf: boolean;
};

const iconSize = "26px";

const PostActions: React.FC<TPostActions> = ({ id, likes, likedBySelf }) => {
	const [isPostLiked, setPostLiked] = React.useState(likedBySelf);
	const [userLikes, setUserLikes] = React.useState(likes);

	const [offcState, setOffcState] = useAtom(offcAtom);

	const { mutate: likePost } = trpc.post.like.useMutation({
		onMutate() {
			setPostLiked(!isPostLiked);
			setUserLikes(userLikes + (isPostLiked ? -1 : 1));
		},
		onError() {
			setPostLiked(!isPostLiked);
			setUserLikes(userLikes + (isPostLiked ? 1 : -1));
		},
	});

	const handleOnLikePost = () => {
		likePost({ post_id: id });
	};

	const showComment = () => {
		setOffcState({
			...offcState,
			show: true,
			view: "COMMENTS",
			postId: id,
		});
	};

	return (
		<ul className="mb-4 ps-2 pb-5 h-100 d-flex flex-md-column align-items-center justify-content-end gap-5">
			<li className="list-group-item">
				<p className="d-flex flex-column align-items-center m-0">
					<Link
						href="javascript:void(0);"
						cb={handleOnLikePost}
						data-postid={id}
						authModal={true}
					>
						{isPostLiked ? (
							<BsHandThumbsUpFill size={iconSize} title="liked" />
						) : (
							<BsHandThumbsUp size={iconSize} title="like" />
						)}
					</Link>
					<span className="mt-1 fw-bold fs-xs">
						{userLikes}
						<span> {userLikes > 1 || userLikes === 0 ? "likes" : "like"}</span>
					</span>
				</p>
			</li>
			<li className="list-group-item">
				<a href="" className="">
					<BsWhatsapp size={iconSize} title="whatsapp" />
				</a>
			</li>
			<li className="list-group-item">
				<a href="javascript:void(0);" onClick={showComment}>
					<FaRegCommentDots size={iconSize} title="comments" />
				</a>
			</li>
		</ul>
	);
};

export default PostActions;
