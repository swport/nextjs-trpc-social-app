import React from "react";
import { fireEvent, waitFor } from "@testing-library/react";
import useCountDown from "@/hooks/useCountDown";
import { useCsrfTokenAtom } from "@/store/csrf";
import { renderWithTRPC, trpcMsw, generateTrpcErrorResponse } from "@/testing-utils/trpc-mock";
import { setupServer } from "msw/node";
import ApiResponse from "@/server/utils/api-response";
import SendOtpForm from "../SendOtpForm";

jest.mock("@/hooks/useCountDown");
jest.mock("@/store/csrf");

describe("SendOTPForm", () => {
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
		const onOtpSentMock = jest.fn();
		(useCountDown as jest.Mock).mockReturnValue([42, startTimerMock]);
		(useCsrfTokenAtom as jest.Mock).mockReturnValueOnce([""]); // force a loading state

		const { getByTestId } = renderWithTRPC(<SendOtpForm onOtpSent={onOtpSentMock} />);
		const sendOtpForm = getByTestId("send-otp-form");
		expect(sendOtpForm).toBeInTheDocument();
	});

	it("renders VerifyOtpForm after sending OTP", async () => {
		let serverOk = true;

		// suppress errors
		jest.spyOn(console, "error").mockImplementation(jest.fn());

		server.use(
			trpcMsw.send_otp.mutation(async (req, res, ctx) => {
				if (!serverOk) {
					// TODO: figure out right way to respond to server error
					// not the right way to respond
					// throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
					return res(ctx.status(500), ctx.json(generateTrpcErrorResponse("send_otp")));
				}
				return res(ctx.status(200), ctx.data(ApiResponse.success("OTP sent successfully")));
			})
		);

		const startTimerMock = jest.fn();
		const onOtpSentMock = jest.fn();
		(useCountDown as jest.Mock).mockReturnValue([42, startTimerMock]);

		const { getByPlaceholderText, getByTestId, getByText } = renderWithTRPC(<SendOtpForm onOtpSent={onOtpSentMock} />);

		const sendOtpForm = getByTestId("send-otp-form");
		const usernameInput = getByPlaceholderText("Enter your email");

		fireEvent.change(usernameInput, { target: { value: "test@invalid-email.com" } });
		fireEvent.submit(sendOtpForm);

		await waitFor(() => {
			expect(getByText(/Invalid email address/i)).toBeInTheDocument();
		});

		const username = "test@yahoo.com";

		fireEvent.change(usernameInput, { target: { value: username } });
		fireEvent.submit(sendOtpForm);

		await waitFor(() => {
			expect(onOtpSentMock).toHaveBeenCalledWith(username);
		});

		onOtpSentMock.mockClear();

		// make server respond with error
		serverOk = false;

		fireEvent.change(usernameInput, { target: { value: username } });
		fireEvent.submit(sendOtpForm);

		await waitFor(() => {
			expect(onOtpSentMock).not.toHaveBeenCalled();
		});
	});
});
