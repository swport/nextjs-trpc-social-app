import React from "react";
import SendOtpForm from "./SendOtpForm";
import VerifyOtpForm from "./VerifyOtpForm";

import useCountDown from "@/hooks/useCountDown";
import useSendOtp from "@/hooks/api/useSendOtp";

import { OTP_SECONDS, MAX_OTP_RESEND_ATTEMPT } from "@/utils/constants";

type TProps = {
	onLoginComplete?: () => void;
};

const LoginForm: React.FC<TProps> = ({ onLoginComplete }) => {
	const [otpUsername, setOtpUsername] = React.useState<string>();
	const [sendOtpPage, setSendOtpPage] = React.useState(true);

	// how many times a user can resend otp
	const [resendCount, setResendCount] = React.useState(0);

	const onCountDownComplete = React.useCallback(() => {
		setResendCount(resendCount + 1);
	}, [resendCount]);

	const [count, startTimer] = useCountDown(OTP_SECONDS, false, onCountDownComplete);
	const { error, loading: resendLoading, isOtpSent, sendOtp } = useSendOtp();

	const onOtpSent = React.useCallback(
		(username: string) => {
			setOtpUsername(username);
			setSendOtpPage(false);
			startTimer();
		},
		[setOtpUsername, startTimer]
	);

	const resendOtp = (e: React.MouseEvent<HTMLAnchorElement>) => {
		e.preventDefault();

		if (resendCount > MAX_OTP_RESEND_ATTEMPT || resendLoading) {
			return;
		}

		if (otpUsername) {
			sendOtp(otpUsername);
		}
	};

	const goBackToSendOtpPage = (e: React.MouseEvent<HTMLAnchorElement>) => {
		e.preventDefault();
		setSendOtpPage(true);
	};

	const onOtpLoginComplete = () => {
		onLoginComplete?.();
	};

	React.useEffect(() => {
		if (isOtpSent && otpUsername) {
			onOtpSent(otpUsername);
		}
	}, [isOtpSent, otpUsername, onOtpSent]);

	return (
		<div>
			{sendOtpPage || !otpUsername ? (
				<SendOtpForm onOtpSent={onOtpSent} />
			) : (
				<div>
					<VerifyOtpForm username={otpUsername} onLoginComplete={onOtpLoginComplete} />

					{resendCount <= MAX_OTP_RESEND_ATTEMPT && count > 0 ? (
						<p className="mt-2 mb-1">
							Resend OTP in {count} second{count > 1 ? "s" : ""}
						</p>
					) : resendCount <= MAX_OTP_RESEND_ATTEMPT ? (
						<p className="mt-2 mb-1">
							<a href="#" onClick={resendOtp} aria-disabled={resendLoading}>
								Resend OTP
							</a>
						</p>
					) : (
						<p className="mt-2">Otp not received? Please refresh page and try again.</p>
					)}
					<p className="mt-0">
						<a href="#" onClick={goBackToSendOtpPage}>
							Use a different username
						</a>
					</p>
				</div>
			)}
			{error ? (
				<p className="my-1 text-danger">
					<small>{error}</small>
				</p>
			) : null}
		</div>
	);
};

export default LoginForm;
