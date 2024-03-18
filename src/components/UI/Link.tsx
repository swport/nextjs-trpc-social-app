import React from "react";
import NextLink, { type LinkProps } from "next/link";
import { useSession } from "next-auth/react";
import { useAtom } from "jotai";
import { modalAtom } from "@/store/modal";

type TProps = React.AnchorHTMLAttributes<HTMLAnchorElement> &
	LinkProps & {
		children: React.ReactNode;
		authModal?: boolean;
		cb?: () => void;
	};

const Link: React.FC<TProps> = ({ href, children, authModal, cb, onClick, ...props }) => {
	const { data: session } = useSession();
	const [modalData, openModal] = useAtom(modalAtom);

	const handleOnClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
		if (authModal && (!session || !session.user)) {
			e.preventDefault();

			openModal({
				...modalData,
				show: true,
				title: "Login with OTP",
				view: "OTP_LOGIN",
			});
		} else if (cb) {
			e.preventDefault();
			cb();
		}
	};

	return (
		<NextLink href={href} onClick={onClick ?? handleOnClick} {...props}>
			{children}
		</NextLink>
	);
};

export default Link;
