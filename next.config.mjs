import path from "path";

const { i18n } = await import("./next-i18next.config.js");

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const config = {
	reactStrictMode: true,

	/**
	 * If you have `experimental: { appDir: true }` set, then you must comment the below `i18n` config
	 * out.
	 *
	 * @see https://github.com/vercel/next.js/issues/41980
	 */
	i18n,
	sassOptions: {
		includePaths: [path.join(path.resolve(), "src")],
	},
	images: {
		domains: ["i.imgur.com", "picsum.photos", "fastly.picsum.photos"],
	},
	compiler: {
		// Enables the styled-components SWC transform
		styledComponents: true
	}
};
export default config;
