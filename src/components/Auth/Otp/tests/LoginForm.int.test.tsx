import React from "react";
import { fireEvent, waitFor } from "@testing-library/react";
import LoginForm from "../LoginForm";
import useCountDown from "@/hooks/useCountDown";
import { useCsrfTokenAtom } from "@/store/csrf";
import { renderWithTRPC, trpcMsw } from "@/testing-utils/trpc-mock";
import { setupServer } from "msw/node";
import ApiResponse from "@/server/utils/api-response";
import VerifyOtpForm from "../VerifyOtpForm";
import { rest } from "msw";
import { OTP_SINGIN_URL } from "@/utils/constants";

jest.mock("@/hooks/useCountDown");
jest.mock("@/store/csrf");

describe("OTP LoginForm Integration Tests", () => {
	// msw server to mock trpc queries and mutations
	const server = setupServer();

	beforeAll(() => {
		(useCsrfTokenAtom as jest.Mock).mockReturnValue(["fake-csrf-token"]);
		server.listen();
	});
	afterAll(() => {
		jest.clearAllMocks();
		server.close();
	});

	it("renders SendOtpForm", () => {
		const startTimerMock = jest.fn();
		const onLoginComplete = jest.fn();
		(useCountDown as jest.Mock).mockReturnValue([42, startTimerMock]);

		const { getByTestId } = renderWithTRPC(<LoginForm onLoginComplete={onLoginComplete} />);
		const sendOtpForm = getByTestId("send-otp-form");
		expect(sendOtpForm).toBeInTheDocument();
	});

	it("renders VerifyOtpForm after sending OTP", async () => {
		server.use(
			trpcMsw.send_otp.mutation(async (req, res, ctx) => {
				return res(ctx.status(200), ctx.data(ApiResponse.success("OTP sent successfully")));
			})
		);

		const startTimerMock = jest.fn();
		(useCountDown as jest.Mock).mockReturnValue([42, startTimerMock]);

		const onLoginComplete = jest.fn();
		const { getByTestId, getByPlaceholderText, getByText } = renderWithTRPC(<LoginForm onLoginComplete={onLoginComplete} />);
		const sendOtpForm = getByTestId("send-otp-form");

		const usernameField = getByPlaceholderText("Enter your email");

		const invalidEmails = ["test@invalid-email.com", "abc", "test@.com"];

		for (const email of invalidEmails) {
			// submits the otp form with an invalid username
			fireEvent.change(usernameField, { target: { value: email } });
			fireEvent.focusOut(usernameField);
			fireEvent.submit(sendOtpForm);

			await waitFor(() => {
				expect(getByText(/invalid email address/i)).toBeInTheDocument();
			});
		}

		// submits the otp form (based on email regex)
		fireEvent.change(usernameField, { target: { value: "test@yahoo.com" } });
		fireEvent.focusOut(usernameField);
		fireEvent.submit(sendOtpForm);

		// state update for when the otp has successfully been sent
		await waitFor(() => {
			expect(startTimerMock).toHaveBeenCalled();
		});

		// verify that the otp form has been loaded on the screen
		const verifyOtpForm = getByTestId("verify-otp-form");

		expect(verifyOtpForm).toBeInTheDocument();
	});

	// call loginComplete on successfully verifying otp
	it("calls loginComplete on successfully verifying otp", async () => {
		let okResponse = true;

		server.use(
			rest.post(`*${OTP_SINGIN_URL}`, (req, res, ctx) => {
				if (!okResponse) {
					return res(ctx.status(500, "Failed"));
				}

				return res(ctx.json({})); //ok
			})
		);

		const onLoginCompleteMock = jest.fn();

		const { getByTestId, getByPlaceholderText, getAllByText } = renderWithTRPC(
			<VerifyOtpForm username="test@yahoo.com" onLoginComplete={onLoginCompleteMock} />
		);

		const verifyOtpForm = getByTestId("verify-otp-form");

		expect(verifyOtpForm).toBeInTheDocument();

		const otpInput = getByPlaceholderText("Enter otp");

		fireEvent.change(otpInput, { target: { value: "1234" } });
		fireEvent.submit(verifyOtpForm);

		await waitFor(() => {
			expect(onLoginCompleteMock).toHaveBeenCalled();
		});

		okResponse = false;
		fireEvent.change(otpInput, { target: { value: "invalid-otp" } });
		fireEvent.submit(verifyOtpForm);

		await waitFor(() => {
			expect(getAllByText(/Invalid Otp/i)[0]).toBeVisible();
		});
	});
});
