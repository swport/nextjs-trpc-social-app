import React from "react";
import Image from "next/image";
import Dropdown from "react-bootstrap/Dropdown";
import PostActions from "./PostActions";
import styled from "styled-components";
import { FaRegUserCircle } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { type TPost } from "@/server/types";
import Link from "../UI/Link";
import { trpc } from "@/utils/trpc";
import { useAtom } from "jotai";
import { notifAtom } from "@/store/notification";
import { formatDate, formatRelativeDate } from "@/utils/dates";

type TPostComp = {
	post: TPost;
	authUserId?: number | null;
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

type AnchorProps = React.HTMLProps<HTMLAnchorElement>;

const DropdownFc = React.forwardRef<HTMLAnchorElement, AnchorProps>(
	({ children, onClick }, ref) => {
		return (
			<a
				href="javascript:void(0);"
				onClick={(e) => {
					e.preventDefault();
					onClick && onClick(e);
				}}
				ref={ref}
			>
				{children}
			</a>
		);
	}
);

DropdownFc.displayName = "DropdownFc";

const Post: React.FC<TPostComp> = ({ post, authUserId }) => {
	const removePostMutation = trpc.post.remove.useMutation();
	const [notifData, setNotifData] = useAtom(notifAtom);

	const removePost = (postId: number) => {
		if (confirm("Are you sure you want to remove your post?")) {
			removePostMutation.mutate(
				{ postId },
				{
					// TODO: remove from the cache
					onSuccess: () => {
						setNotifData({
							...notifData,
							show: true,
							title: "Post removed",
							content: "Post was removed successfully",
						});
					},
				}
			);
		}
	};

	return (
		<div className="border rounded">
			<div className="p-1 p-md-3 border border-0 border-bottom">
				<div className="d-flex align-items-start">
					<div className="d-flex align-items-center mb-2">
						<picture>
							<FaRegUserCircle size="42px" />
						</picture>
						<p className="m-0 ms-2 lh-sm">
							<b>{post?.User?.name}</b> <br />
							<span
								className="fs-xs text-muted"
								title={formatDate(post.createdAt)}
							>
								{formatRelativeDate(post.createdAt)}
							</span>
						</p>
					</div>
					<Dropdown className="ms-auto">
						<Dropdown.Toggle as={DropdownFc}>
							<BsThreeDotsVertical size="32px" />
						</Dropdown.Toggle>

						<Dropdown.Menu>
							<Dropdown.Item as="div" eventKey="1">
								<Link href={`/post/${post.id}`}>View Post</Link>
							</Dropdown.Item>
							{authUserId && authUserId === post.User?.id ? (
								<Dropdown.Item
									eventKey="2"
									className="text-danger"
									onClick={() => removePost(post.id)}
								>
									Remove post
								</Dropdown.Item>
							) : null}
						</Dropdown.Menu>
					</Dropdown>
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
