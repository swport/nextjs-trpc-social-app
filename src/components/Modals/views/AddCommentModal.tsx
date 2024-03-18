import React from "react";
import AddCommentForm from "@/components/Comment/AddCommentForm";
import { modalAtom } from "@/store/modal";
import { useAtom } from "jotai";
import { notifAtom } from "@/store/notification";

const AddCommentModal = () => {
	const [modalData, setModalData] = useAtom(modalAtom);
	const [, openNotif] = useAtom(notifAtom);

	const onCommentAdded = () => {
		setModalData({
			...modalData,
			show: false,
		});

		openNotif({
			show: true,
			title: "Comment added",
			content: "Your comment added successfully",
			type: "SUCCESS",
		});
	};

	if (Number(modalData["postId"]) <= 0) {
		return <p className="alert alert-danger">Invalid state</p>;
	}

	return (
		<div className="p-1">
			<AddCommentForm
				postId={Number(modalData["postId"])}
				onCommentAdded={onCommentAdded}
			/>
		</div>
	);
};

export default AddCommentModal;
