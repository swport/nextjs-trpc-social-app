import React from "react";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
// import { type AppType } from "next/app";
import { trpc } from "@/utils/trpc";
import { appWithTranslation } from "next-i18next";
import { AppModal, NotificationToast, OffCanvas } from "@/components";
import PrivateRoute from "@/components/Auth/PrivateRoute";
import type { NextComponentType } from "next";

// this doesn't look right;
// TODO: find better solution
import type { AppPropsType, AppContextType } from "next/dist/shared/lib/utils";

import "../styles/styles.scss";

type CustomProps = { session: Session | null };

type CustomComponentProps = {
	auth?: boolean;
	layout?: (page: React.ReactElement) => React.ReactElement;
};

type CustomAppType = NextComponentType<
	AppContextType,
	CustomProps,
	AppPropsType<any, CustomProps> & {
		Component: AppPropsType["Component"] & CustomComponentProps;
	}
>;

// type MyAppType = AppType<{ session: Session | null }>;

const MyApp: CustomAppType = ({
	Component,
	pageProps: { session, ...pageProps },
}) => {
	const requires_auth = Boolean(Component.auth);
	const getPageLayout = Component.layout ?? ((page) => page);

	return (
		<SessionProvider session={session}>
			{requires_auth ? (
				<PrivateRoute>
					getPageLayout(
					<Component {...pageProps} />)
				</PrivateRoute>
			) : (
				getPageLayout(<Component {...pageProps} />)
			)}
			<AppModal />
			<NotificationToast />
			<OffCanvas />
		</SessionProvider>
	);
};

export default trpc.withTRPC(appWithTranslation(MyApp));
