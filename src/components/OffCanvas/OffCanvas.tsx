import { closeOffcAtom, offcAtom } from "@/store/offcanvas";
import { useAtom } from "jotai";
import React from "react";
import Modal from "react-bootstrap/Modal";
import { ModalProps } from "react-bootstrap";
import Offcanvas from "react-bootstrap/Offcanvas";
import CommentsOffCanvas from "./views/CommentsOffCanvas";

type TAppModal = {
	config?: ModalProps;
};

const OffCanvas: React.FC<TAppModal> = ({ config }) => {
	const [{ show, title, view }] = useAtom(offcAtom);
	const [, closeOffCanvas] = useAtom(closeOffcAtom);

	return (
		<Offcanvas show={show} onHide={() => closeOffCanvas()} placement="end">
			<Offcanvas.Header closeButton>
				{title && <Offcanvas.Title>{title}</Offcanvas.Title>}
			</Offcanvas.Header>
			<Offcanvas.Body>
				{view === "COMMENTS" && <CommentsOffCanvas />}
			</Offcanvas.Body>
		</Offcanvas>
	);
};

export default OffCanvas;
