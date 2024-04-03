import { type SSTConfig } from "sst";
import { NextjsSite } from "sst/constructs";

// https://stackoverflow.com/a/61895318
export default {
	config(_input) {
		return {
			name: "wsp-main",
			region: "us-east-1",
		};
	},
	stacks(app) {
		app.stack(function Site({ stack }) {
			const site = new NextjsSite(stack, "site");

			stack.addOutputs({
				SiteUrl: site.url,
			});
		});
	},
} satisfies SSTConfig;
