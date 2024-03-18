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
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}
