import React from "react";
import { trpc } from "@/utils/trpc";
import { type TComment } from "@/server/types";
import { FaTrashAlt } from "react-icons/fa";
import { notifAtom } from "@/store/notification";
import { useAtom } from "jotai";
import { formatRelativeDate, formatDate } from "@/utils/dates";

type TCComment = {
	authUserId: number | undefined | null;
	comment: TComment;
};

const Comment: React.FC<TCComment> = ({ authUserId, comment }) => {
	const [notifData, setNotifData] = useAtom(notifAtom);
	const deleteMutation = trpc.comment.delete.useMutation();

	const handleDeleteCommentBtnClick = (commentId: number) => {
		if (confirm("Are you sure you want to remove your comment?")) {
			deleteMutation.mutate(
				{ commentId },
				{
					onSuccess: () => {
						setNotifData({
							...notifData,
							show: true,
							content: "Comment removed",
						});
					},
				}
			);
		}
	};

	return (
		<div className="mb-2">
			<div className="card">
				<div className="card-body">
					<div className="d-flex align-items-center">
						<div>
							<h6 className="card-title">{comment.User?.name}</h6>
							<p className="card-text">{comment.content}</p>
							<p
								className="fs-xs text-muted mt-2 mb-0"
								title={formatDate(comment.createdAt)}
							>
								{formatRelativeDate(comment.createdAt)}
							</p>
						</div>
						<div className="ms-auto ps-2 ps-md-3">
							{!!authUserId && comment.User?.id === authUserId ? (
								<a
									href="javascript:void(0);"
									onClick={() => handleDeleteCommentBtnClick(comment.id)}
									className="d-flex align-items-center"
								>
									<FaTrashAlt
										size="1.2em"
										className="text-danger"
										title="Delete comment"
									/>
								</a>
							) : null}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Comment;
