import React from "react";
import { trpc } from "@/utils/trpc";

type TSendOtpHookRType = {
	error?: string;
	loading: boolean;
	isOtpSent: boolean;
	sendOtp: (username: string) => void;
};

const useSendOtp = (): TSendOtpHookRType => {
	const sendOtpMutation = trpc.send_otp.useMutation();

	const [error, setError] = React.useState<string>();
	const [isLoading, setLoading] = React.useState(false);

	const [isOtpSent, setOtpSent] = React.useState(false);

	const sendOtp = (username: string) => {
		if (isLoading) return;

		setLoading(true);
		setOtpSent(false);
		setError("");

		sendOtpMutation.mutate(
			{ username },
			{
				onSuccess: () => {
					setOtpSent(true);
				},
				onError: ({ data }) => {
					if (data?.inputValidationError?.fieldErrors?.username?.length) {
						setError(
							data.inputValidationError.fieldErrors.username[0] ?? "Something went wrong at the server"
						);
					} else {
						setError("Something went wrong at the server");
					}
				},
				onSettled: () => {
					setLoading(false);
				},
			}
		);
	};

	return { error, loading: isLoading, isOtpSent, sendOtp };
};

export default useSendOtp;
