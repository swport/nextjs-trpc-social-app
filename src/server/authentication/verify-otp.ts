import prismaAdapter from "../prisma-adapter";

const VerifyOtpUpdateUser = async (username: string, otp: string) => {
	const user = await prismaAdapter.getUserByEmail(username);

	if (user && user.id && user.otp === otp) {
		user.emailVerified = new Date();
		user.otp = null;

		await prismaAdapter.updateUser(user);

		return {
			id: parseInt(user.id),
			name: user.name,
			email: user.email,
			image: user.image,
		};
	}

	return null;
};

export default VerifyOtpUpdateUser;
