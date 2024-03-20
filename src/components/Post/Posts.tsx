import React from "react";
import useFetchPosts from "./useFetchPosts";
import usePageBottom from "@/hooks/usePageBottom";
import Post from "./Post";
import styled from "styled-components";
import { useAtom } from "jotai";
import { modalAtom } from "@/store/modal";
import { useSession } from "next-auth/react";

const AddPostButton = styled.button`
	display: block;
	position: sticky;
	margin-left: auto;
	bottom: 22px;
`;

const Posts: React.FC = () => {
	const [modalData, setModalData] = useAtom(modalAtom);
	const { data: session, status } = useSession();

	const {
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		data: posts,
	} = useFetchPosts();

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

	const handleAddPostBtnClick = () => {
		setModalData({
			...modalData,
			show: true,
			title: "Add a post",
			view: "ADD_POST",
		});
	};

	const authUserId = session?.user.id;

	return (
		<React.Fragment>
			<div className="mt-2 mt-md-3 vstack gap-5 position-relative">
				{posts?.pages.map((group, i) => (
					<React.Fragment key={i}>
						{group?.results?.data.map((post) => (
							<Post key={post.id} post={post} authUserId={authUserId} />
						))}
					</React.Fragment>
				))}

				{isFetchingNextPage ? (
					<div className="d-flex justify-content-center">
						<div className="spinner-border" role="status">
							<span className="visually-hidden">Loading...</span>
						</div>
					</div>
				) : null}
			</div>
			<AddPostButton
				onClick={handleAddPostBtnClick}
				type="button"
				className="btn btn-primary"
			>
				<span className="fw-bold fs-sm">+ Add Post</span>
			</AddPostButton>
		</React.Fragment>
	);
};

export default Posts;
