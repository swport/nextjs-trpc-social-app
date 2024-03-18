import React from "react";
import OtpLoginForm from "../../Auth/Otp/LoginForm";
import { closeModalAtom } from "@/store/modal";
import { useAtom } from "jotai";

const OtpLoginModal = () => {
	const [, closeModal] = useAtom(closeModalAtom);

	const onLoginComplete = () => {
		closeModal();
	};

	return (
		<div className="p-3">
			<OtpLoginForm onLoginComplete={onLoginComplete} />
		</div>
	);
};

export default OtpLoginModal;
