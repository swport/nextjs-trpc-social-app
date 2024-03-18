export const OTP_SECONDS = 35;
export const OTP_INPUT_LENGTH = 5;
export const MAX_OTP_RESEND_ATTEMPT = 5;

export const POSTS_PER_PAGE = 15;

export const COMMENT_PER_PAGE = 15;

export const MAX_UPLOAD_FILE_SIZE = 180000; // 180 kb
export const ACCEPTED_UPLOAD_IMAGE_TYPES = [
	"image/jpeg",
	"image/jpg",
	"image/png",
	"image/webp",
	"image/gif",
];

// non-trpc ENDPOINTS
export const OTP_SINGIN_URL = "/api/auth/callback/otp";
