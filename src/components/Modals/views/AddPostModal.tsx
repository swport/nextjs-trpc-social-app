import React from "react";
import AddPostForm from "@/components/Post/AddPostForm";
import { closeModalAtom } from "@/store/modal";
import { useAtom } from "jotai";
import { notifAtom } from "@/store/notification";

const AddPostModal = () => {
	const [, closeModal] = useAtom(closeModalAtom);
	const [notifData, openNotif] = useAtom(notifAtom);

	const onPostAdded = () => {
		closeModal();

		openNotif({
			show: true,
			title: "Post added",
			content: "Your post added successfully",
			type: "SUCCESS",
		});
	};

	return (
		<div className="p-1">
			<AddPostForm onPostAdded={onPostAdded} />
		</div>
	);
};

export default AddPostModal;
