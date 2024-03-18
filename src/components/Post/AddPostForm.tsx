import React from "react";
import Form from "react-bootstrap/Form";
import { useTranslation } from "next-i18next";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ACCEPTED_UPLOAD_IMAGE_TYPES } from "@/utils/constants";
import { addPostFormSchema } from "@/utils/form-schemas";
import useAddPost from "./useAddPost";

const accpetImageKey = ACCEPTED_UPLOAD_IMAGE_TYPES.join(",");

const formSchema = z.object(addPostFormSchema);

type FormValues = {
	title: string;
	image: string;
};

type TProps = {
	onPostAdded?: () => void;
};

const AddPostForm: React.FC<TProps> = ({ onPostAdded }) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		setError,
		getValues,
	} = useForm<FormValues>({ resolver: zodResolver(formSchema) });
	const { t } = useTranslation();
	const { error: serverError, loading, addPost, isPostAdded } = useAddPost();

	const onSubmitPost: SubmitHandler<FormValues> = (data) => {
		addPost(data.title);
	};

	React.useEffect(() => {
		if (isPostAdded && onPostAdded) {
			onPostAdded();
		}
	}, [isPostAdded]);

	return (
		<form onSubmit={handleSubmit(onSubmitPost)} aria-disabled={loading}>
			<div className="input-group mb-3">
				<div className="form-floating">
					<Form.Control
						type="text"
						className="form-control"
						placeholder={t("Enter title")}
						aria-label="Enter title"
						{...register("title")}
						isInvalid={!!errors.title}
						autoFocus={true}
						size="sm"
					/>
					<label htmlFor="floatingInput">{t("Enter title")}</label>
				</div>
			</div>
			<div className="input-group mb-3">
				<label className="input-group-text" htmlFor="addPostUploadImage">
					Image
				</label>
				<Form.Control
					type="file"
					className="form-control"
					aria-label="Upload file"
					id="addPostUploadImage"
					accept={accpetImageKey}
					{...register("image")}
				/>
			</div>
			<div className="input-group">
				<button type="submit" className="btn btn-primary" disabled={loading}>
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

export default AddPostForm;
