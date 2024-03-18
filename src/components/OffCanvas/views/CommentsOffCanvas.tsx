import React from "react";
import { offcAtom } from "@/store/offcanvas";
import { useAtom } from "jotai";
import Comments from "@/components/Comment/Comments";

const CommentsOffCanvas = () => {
	const [offcState] = useAtom(offcAtom);

	if (Number(offcState["postId"]) <= 0) {
		return <p className="text-danger">Invalid state</p>;
	}

	return (
		<div className="py-2">
			<Comments postId={Number(offcState["postId"])} />
		</div>
	);
};

export default CommentsOffCanvas;
