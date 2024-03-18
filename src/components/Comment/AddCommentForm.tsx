import React from "react";
import Form from "react-bootstrap/Form";
import { useTranslation } from "next-i18next";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import useAddComment from "./useAddComment";

const formSchema = z.object({
	content: z.string().nonempty().min(3),
});

type FormValues = {
	content: string;
};

type TProps = {
	postId: number;
	onCommentAdded?: () => void;
};

const AddCommentForm: React.FC<TProps> = ({ postId, onCommentAdded }) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		setError,
		getValues,
	} = useForm<FormValues>({ resolver: zodResolver(formSchema) });
	const { t } = useTranslation();
	const {
		error: serverError,
		loading,
		addComment,
		isCommentAdded,
	} = useAddComment();

	const onSubmitPost: SubmitHandler<FormValues> = (data) => {
		addComment(postId, data.content);
	};

	React.useEffect(() => {
		if (isCommentAdded && onCommentAdded) {
			onCommentAdded();
		}
	}, [isCommentAdded]);

	return (
		<form onSubmit={handleSubmit(onSubmitPost)} aria-disabled={loading}>
			<div className="input-group mb-3">
				<div className="form-floating">
					<Form.Control
						as="textarea"
						rows={4}
						style={{ height: "120px" }}
						placeholder={t("Enter comment")}
						aria-label="Enter comment"
						{...register("content")}
						isInvalid={!!errors.content}
						autoFocus={true}
					/>
					<label htmlFor="floatingInput">{t("Enter comment")}</label>
				</div>
			</div>
			<div className="input-group">
				<button
					type="submit"
					className="btn btn-sm btn-primary"
					disabled={loading}
				>
					Create
				</button>
			</div>
			{(Object.keys(errors) as (keyof typeof errors)[]).map((key) => (
				<p key={key} className="my-1 text-danger">
					<small>{errors[key]?.message}</small>
				</p>
			))}
			{serverError && (
				<p className="my-1 text-danger">
					<small>{serverError}</small>
				</p>
			)}
		</form>
	);
};

export default AddCommentForm;
