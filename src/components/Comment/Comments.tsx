import React from "react";
import { trpc } from "@/utils/trpc";
import { COMMENT_PER_PAGE } from "@/utils/constants";
import usePageBottom from "@/hooks/usePageBottom";
import { useAtom } from "jotai";
import { modalAtom } from "@/store/modal";
import { useSession } from "next-auth/react";
import Comment from "./Comment";

type TProps = {
	postId: number;
};

const Comments: React.FC<TProps> = ({ postId }) => {
	const [modalData, setModalData] = useAtom(modalAtom);
	const { data: session, status } = useSession();

	const {
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		data: comments,
	} = trpc.comment.list.useInfiniteQuery(
		{
			limit: COMMENT_PER_PAGE,
			postId,
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

	const atTheBottom = usePageBottom();

	const [isAtBottom, setAtBottom] = React.useState(false);

	React.useEffect(() => {
		setAtBottom(atTheBottom);
	}, [atTheBottom]);

	React.useEffect(() => {
		if (isAtBottom && hasNextPage && !isFetchingNextPage) {
			setAtBottom(false);
			fetchNextPage();
		}
	}, [isAtBottom, isFetchingNextPage, hasNextPage]);

	const handleAddCommentBtnClick = () => {
		setModalData({
			...modalData,
			show: true,
			title: "Add comment",
			view: "ADD_COMMENT",
			postId,
		});
	};

	return (
		<div>
			<div className="position-sticky-top-0 d-flex align-items-center mb-3">
				<h5>Comments: </h5>
				<button
					type="button"
					onClick={handleAddCommentBtnClick}
					className="btn btn-sm btn-primary ms-auto"
				>
					+ Add comment
				</button>
			</div>

			{!comments?.pages.length || comments?.pages.length <= 0 ? (
				<p>No comments yet!</p>
			) : null}

			{comments?.pages.map((group, idx) => (
				<React.Fragment key={idx}>
					{group?.results?.data.map((comment) => (
						<Comment
							key={comment.id}
							comment={comment}
							authUserId={session?.user.id}
						/>
					))}
				</React.Fragment>
			))}
		</div>
	);
};

export default Comments;
