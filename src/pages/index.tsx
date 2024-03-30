import React from "react";
import { AppLayout, Posts } from "@/components";
import Head from "next/head";

const Home = () => {
	return (
		<>
			<Head>
				<title>Simple full-stack Next.js social site</title>
			</Head>
			<AppLayout>
				<Posts />
			</AppLayout>
		</>
	);
};

export default Home;
