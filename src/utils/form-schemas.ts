import { z } from "zod";
import { type ZodRawShape } from "zod";
import {
	MAX_UPLOAD_FILE_SIZE,
	ACCEPTED_UPLOAD_IMAGE_TYPES,
} from "@/utils/constants";

export const addPostFormSchema = {
	title: z.string().nonempty().min(3),
	image: z
		.any()
		.transform((files) =>
			files && typeof files.length !== "undefined" ? files[0] : files
		)
		.refine((file) => file && file?.size, "Post image is required")
		.refine(
			(file) => file?.size <= MAX_UPLOAD_FILE_SIZE,
			"Maximum file size is 180kb"
		)
		.refine(
			(file) => ACCEPTED_UPLOAD_IMAGE_TYPES.includes(file?.type),
			"Only .jpg, .jpeg, .png and .webp formats are supported."
		),
};
