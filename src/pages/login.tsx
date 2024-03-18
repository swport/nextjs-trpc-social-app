import LoginForm from "@/components/Auth/Otp/LoginForm";
import type { GetStaticProps } from "next";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const redirectUri = "/";

const Login = () => {
	const router = useRouter();

	const onLoginComplete = () => {
		void router.replace(redirectUri);
	};

	return (
		<div className="container">
			<div className="row justify-content-center mt-3 mt-md-5">
				<div className="col-12 col-sm-10 col-md-6">
					<div className="card d-flex align-items-center py-4">
						<div className="card-body w-lg-75 p-1 p-md-4">
							<LoginForm onLoginComplete={onLoginComplete} />
						</div>
					</div>
					<p>
						<small>&copy; 2023 wsy.com. All rights reserved.</small>
					</p>
				</div>
			</div>
		</div>
	);
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
	return {
		props: {
			...(await serverSideTranslations(locale ?? "hi-IN")),
		},
	};
};

Login.authenticated = false;

export default Login;
