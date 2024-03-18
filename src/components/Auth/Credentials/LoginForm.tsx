import React from "react";
import { useCsrfTokenAtom } from "@/store/csrf";

type TProps = {
	onLoginComplete?: () => void;
};

const emailSignInUri = "/api/auth/callback/credentials";

const LoginForm: React.FC<TProps> = ({ onLoginComplete }) => {
	const [csrfToken] = useCsrfTokenAtom();

	const [email, setEmail] = React.useState("");
	const [password, setPassword] = React.useState("");
	const [loading, setLoading] = React.useState(false);
	const [error, setError] = React.useState("");

	const handleCloseErrorMessage = () => {
		setError("");
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const postLogin = async () => {
			try {
				setLoading(true);
				setPassword("");

				const res = await fetch(emailSignInUri, {
					method: "post",
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
					},

					body: new URLSearchParams({
						email,
						password,
						csrfToken: csrfToken ?? "",
						callbackUrl: window.location.href,
						json: "true",
					}),
				});

				if (!res.ok) {
					setError("Invalid email/password. Please try again.");
				} else {
					const data = (await res.json()) as { [key: string]: string };

					if (data?.url && new URL(data.url).searchParams.get("csrf") == "true") {
						setError("Something went wrong at the server. Please try again by refreshing the page.");
					} else {
						setError("");
						if (onLoginComplete) {
							onLoginComplete();
						}
					}
				}

				setLoading(false);
			} catch (e) {
				let message = "Something went wrong.";
				if (typeof e === "string") {
					message = e.toUpperCase();
				} else if (e instanceof Error) {
					message = e.message;
				}
				setError("Something went wrong.");
				setLoading(false);
				console.error(message);
			}
		};

		void postLogin();
	};

	return (
		<form onSubmit={handleSubmit} id="auth-credentials" data-testid="auth-credentials">
			<div className="mb-3">
				<label htmlFor="email" className="form-label">
					Email address
				</label>
				<input
					onChange={(e) => setEmail(e.target.value)}
					type="email"
					className="form-control"
					id="email"
					aria-describedby="login username"
					required
				/>
			</div>
			<div className="mb-3">
				<label htmlFor="password" className="form-label">
					Password
				</label>
				<input
					onChange={(e) => setPassword(e.target.value)}
					type="password"
					className="form-control"
					id="password"
					required
				/>
			</div>
			<input type="hidden" name="csrfToken" value={csrfToken ?? ""} />
			{error ? (
				<div className="alert alert-danger border-0 alert-dismissible fade show" role="alert">
					<span className="fs-sm">{error}</span>
					<button type="button" className="btn-sm btn-close" aria-label="Close" onClick={handleCloseErrorMessage}></button>
				</div>
			) : null}
			<button type="submit" className="btn btn-primary" disabled={!csrfToken || loading}>
				{!csrfToken || loading ? (
					<>
						<span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
						<span className="visually-hidden">Loading...</span>
					</>
				) : (
					"Submit"
				)}
			</button>
		</form>
	);
};

export default LoginForm;
