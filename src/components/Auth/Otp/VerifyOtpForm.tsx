import React from "react";
import { signIn } from "next-auth/react";
import { OTP_INPUT_LENGTH } from "@/utils/constants";
import OtpInput from "react-otp-input";

type TProps = {
	username: string;
	onLoginComplete: () => void;
};

const VerifyOtpForm: React.FC<TProps> = ({ username, onLoginComplete }) => {
	const [loading, setLoading] = React.useState(false);
	const [otp, setOtp] = React.useState("");
	const [error, setError] = React.useState("");

	const handleCloseErrorMessage = () => {
		setError("");
	};

	const handleSendOtpSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const postLogin = async () => {
			try {
				setLoading(true);
				setOtp("");
				setError("");

				const res = await signIn("otp", {
					redirect: false,
					username,
					otp,
				});

				if (!res || !res.ok || res.status !== 200) {
					setError("Invalid Otp. Please try again.");
				} else {
					if (res?.url && new URL(res.url).searchParams.get("csrf") == "true") {
						alert("Please try again");
						window.location.reload();
						return;
					} else {
						setError("");
						if (onLoginComplete) onLoginComplete();
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
				// TODO: log server message
				setError("Something went wrong.");
				setLoading(false);
			}
		};

		void postLogin();
	};

	return (
		<form onSubmit={handleSendOtpSubmit} data-testid="verify-otp-form">
			<h4>Enter OTP</h4>
			<div className="mb-2">
				<OtpInput
					value={otp}
					onChange={setOtp}
					numInputs={OTP_INPUT_LENGTH}
					shouldAutoFocus={true}
					inputStyle="form-control"
					containerStyle="input-group input-group-lg"
					renderInput={(props) => <input id="password" required {...props} />}
				/>
			</div>
			{error ? (
				<div
					className="alert alert-danger border-0 alert-dismissible fade show"
					role="alert"
				>
					<span className="fs-sm">{error}</span>
					<button
						type="button"
						className="btn-sm btn-close"
						aria-label="Close"
						onClick={handleCloseErrorMessage}
					></button>
				</div>
			) : null}
			{error ? (
				<div id="validationServer03Feedback" className="invalid-feedback">
					{error}
				</div>
			) : null}
			<button
				className="btn btn-primary btn-md"
				type="submit"
				disabled={loading}
			>
				{loading ? (
					<>
						<span
							className="spinner-border spinner-border-sm"
							role="status"
							aria-hidden="true"
						></span>
						<span className="visually-hidden">Loading...</span>
					</>
				) : (
					"Login"
				)}
			</button>
		</form>
	);
};

export default VerifyOtpForm;
