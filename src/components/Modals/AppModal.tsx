import { closeModalAtom, modalAtom } from "@/store/modal";
import { useAtom } from "jotai";
import React from "react";
import Modal from "react-bootstrap/Modal";
import { ModalProps } from "react-bootstrap";
import OtpLoginModal from "./views/OtpLoginModal";
import AddPostModal from "./views/AddPostModal";
import AddCommentModal from "./views/AddCommentModal";

type TAppModal = {
	config?: ModalProps;
};

const AppModal: React.FC<TAppModal> = ({ config }) => {
	const [{ show, title, view }] = useAtom(modalAtom);
	const [, closeModal] = useAtom(closeModalAtom);

	return (
		<Modal
			show={show}
			onHide={() => closeModal()}
			animation={false}
			{...(config || ({} as ModalProps))}
		>
			{title !== "" ? (
				<Modal.Header closeButton>
					<Modal.Title as="h5">{title}</Modal.Title>
				</Modal.Header>
			) : null}
			<Modal.Body>
				{view === "OTP_LOGIN" && <OtpLoginModal />}
				{view === "ADD_POST" && <AddPostModal />}
				{view === "ADD_COMMENT" && <AddCommentModal />}
			</Modal.Body>
		</Modal>
	);
};

export default AppModal;
