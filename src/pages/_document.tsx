import Document, { Html, Head, Main, NextScript } from "next/document";
import type { DocumentContext } from "next/document";

export default class CustomDocument extends Document {
	static async getInitialProps(ctx: DocumentContext) {
		return Document.getInitialProps(ctx);
	}

	render() {
		return (
			<Html data-bs-theme="light" lang="en">
				<Head
					lang="en-IN"
					prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/fb#"
					itemScope
					itemType="http://schema.org/WebPage"
					className="h-full"
				>
					<meta name="x-csrf-token" content="" />
					<meta
						name="description"
						content="Next.js, Trpc, Prisma and Bootstrap based simple social site"
					/>
					<meta
						name="keywords"
						content="nextjs, trpc, prisma, mysql, bootstrap"
					/>
					<meta name="robots" content="index, follow" />
					<meta name="googlebot" content="index, follow" />
					<meta
						name="viewport"
						content="width=device-width, initial-scale=1.0"
					/>
					<meta charSet="utf-8" />
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}
