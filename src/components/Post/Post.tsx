import React from "react";
import Image from "next/image";
import PostActions from "./PostActions";
import styled from "styled-components";
import { FaRegUserCircle } from "react-icons/fa";
import { TPost } from "@/server/types";

type TPostComp = {
	post: TPost;
};

const PostDiv = styled.div`
	min-height: 280px;
`;

const PostPicture = styled.picture`
	max-width: 100%;
`;

const PostImageStyles: React.CSSProperties = {
	width: "auto",
	height: "auto",
	objectFit: "contain",
	maxWidth: "100%",
};

const Post: React.FC<TPostComp> = ({ post }) => {
	return (
		<div className="border rounded">
			<div className="p-1 p-md-3 border border-0 border-bottom">
				<div className="d-flex align-items-center mb-2">
					<picture>
						<FaRegUserCircle size="42px" />
					</picture>
					<span className="ms-2 fw-bold">{post?.User?.name}</span>
				</div>
				{post.content && <p className="mb-2">{post.content}</p>}
			</div>

			<PostDiv
				data-postid={post.id}
				className="post-list row align-items-center"
			>
				<div className="col-12 col-md-10 d-flex align-items-end justify-content-center">
					<PostPicture className="position-relative text-center">
						<Image
							src={post.file_path ?? ""}
							alt={post.file_path ?? ""}
							width={640}
							height={480}
							style={PostImageStyles}
						/>
					</PostPicture>
				</div>
				<div className="col-12 col-md-2 align-self-stretch position-relative">
					<PostActions
						id={post.id}
						likes={post.likes}
						likedBySelf={post.likedBySelf}
					/>
				</div>
			</PostDiv>
		</div>
	);
};

export default Post;
