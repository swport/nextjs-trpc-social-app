import type { NextApiRequest } from "next";
import { createHash } from "crypto";
import { env } from "@/env.mjs";

// currently not being used;
// but was intially coded to protect post requests on public routes
export default function verifyCSRFToken(req: NextApiRequest, tokenToCheck: string) {
	const secret = process.env.NEXTAUTH_SECRET;
	const csrfMethods = ["POST", "PUT", "PATCH", "DELETE"];

	if (!secret) {
		return false;
	}

	if (req?.method && !csrfMethods.includes(req.method)) {
		return true;
	}

	try {
		const useSecureCookies = env.NEXTAUTH_URL.startsWith("https://");
		const csrfProp = `${useSecureCookies ? "__Host-" : ""}next-auth.csrf-token`;

		if (req.cookies[csrfProp]) {
			const cookieValue = req.cookies[csrfProp];
			if (cookieValue) {
				const cookieSplitKey = cookieValue.match("|") ? "|" : "%7C";

				const [csrfTokenValue, csrfTokenHash] = cookieValue.split(cookieSplitKey);

				const generatedHash = createHash("sha256").update(`${tokenToCheck}${secret}`).digest("hex");

				if (csrfTokenHash === generatedHash) {
					// If hash matches then we trust the CSRF token value
					if (csrfTokenValue === tokenToCheck) return true;
				}
			}
		}

		return false;
	} catch (error) {
		// TODO: log error verifying csrf token
		return false;
	}
}
