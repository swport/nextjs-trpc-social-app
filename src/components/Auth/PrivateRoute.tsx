import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type TProps = {
	children: React.ReactNode;
};

const PrivateRoute: React.FC<TProps> = ({ children }) => {
	const { data: session, status } = useSession();
	const router = useRouter();

	if (status === "loading") {
		return <p>Loading...</p>;
	}

	if (!session || !session.user) {
		// TODO: redirect to the visited link
		router.replace("/login");
		return <></>;
	}

	return <>{children}</>;
};

export default PrivateRoute;
