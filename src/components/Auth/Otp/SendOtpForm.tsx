import React from "react";
import { useCsrfTokenAtom } from "@/store/csrf";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import Form from "react-bootstrap/Form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { emailProviderRegex } from "@/utils/validations/email";
import useSendOtp from "../../../hooks/api/useSendOtp";
import { useTranslation } from "next-i18next";
import { getCsrfToken } from "next-auth/react";

const formSchema = z.object({
	username: z.string().regex(emailProviderRegex, "Invalid email address"),
});

type FormValues = {
	username: string;
};

type TProps = {
	onOtpSent: (username: string) => void;
};

const SendOtpForm: React.FC<TProps> = ({ onOtpSent }) => {
	const { error: serverError, loading, isOtpSent, sendOtp } = useSendOtp();
	const { t } = useTranslation();

	const {
		register,
		handleSubmit,
		formState: { errors },
		setError,
		getValues,
	} = useForm<FormValues>({ resolver: zodResolver(formSchema) });

	React.useEffect(() => {
		if (serverError && serverError !== "") {
			setError("username", { type: "custom", message: serverError });
		}
	}, [serverError, setError]);

	React.useEffect(() => {
		if (isOtpSent) {
			const { username } = getValues();
			onOtpSent(username);
		}
	}, [isOtpSent, onOtpSent, getValues]);

	const onSendOtp: SubmitHandler<FormValues> = (data) => {
		sendOtp(data.username);
	};

	return (
		<form onSubmit={handleSubmit(onSendOtp)} data-testid="send-otp-form">
			<div className="input-group">
				<div className="form-floating">
					<Form.Control
						type="text"
						className="form-control"
						placeholder={t("Enter your email")}
						aria-label="Enter your email to receive otp code"
						disabled={loading}
						{...register("username")}
						isInvalid={!!errors.username}
						autoFocus={true}
					/>
					<label htmlFor="floatingInput">{t("Enter your email")}</label>
				</div>
				<button className="btn btn-primary input-group-text" type="submit" disabled={loading}>
					{loading ? (
						<>
							<span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
							<span className="visually-hidden">{t("Loading")}...</span>
						</>
					) : (
						t("Login")
					)}
				</button>
			</div>
			{(Object.keys(errors) as (keyof typeof errors)[]).map((key) => (
				<p key={key} className="my-1 text-danger">
					<small>{errors[key]?.message}</small>
				</p>
			))}
		</form>
	);
};

export default SendOtpForm;
