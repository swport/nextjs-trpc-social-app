import React from "react";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import { closeNotifAtom, notifAtom } from "@/store/notification";
import { useAtom } from "jotai";
import Link from "./Link";

const POST_HIDE_TIME = 3000;

const NotificationBar = () => {
	const [{ show, title, content, link, link_text }] = useAtom(notifAtom);
	const [, closeModal] = useAtom(closeNotifAtom);

	return (
		<ToastContainer position="bottom-end" className="p-3 position-fixed">
			<Toast
				show={show}
				onClose={() => closeModal()}
				delay={POST_HIDE_TIME}
				autohide
			>
				<Toast.Header>
					{title && <strong className="me-auto">{title}</strong>}
				</Toast.Header>
				<Toast.Body>
					{content}
					{link && (
						<Link href={link} className="d-block mt-2">
							{link_text ?? "View"}
						</Link>
					)}
				</Toast.Body>
			</Toast>
		</ToastContainer>
	);
};

export default NotificationBar;
