import React from "react";
import { fireEvent, waitFor } from "@testing-library/react";
import useCountDown from "@/hooks/useCountDown";
import { useCsrfTokenAtom } from "@/store/csrf";
import { renderWithTRPC, trpcMsw, generateTrpcErrorResponse } from "@/testing-utils/trpc-mock";
import { setupServer } from "msw/node";
import ApiResponse from "@/server/utils/api-response";
import VerifyOtpForm from "../VerifyOtpForm";

describe("VerifyOTPForm unit test", () => {
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
		const username = "test@yahoo.com";
		const onLoginCompleteMock = jest.fn();

		const { getByTestId } = renderWithTRPC(<VerifyOtpForm username={username} onLoginComplete={onLoginCompleteMock} />);
		const verifyOtpForm = getByTestId("verify-otp-form");

		waitFor(() => {
			expect(verifyOtpForm).toBeInTheDocument();
		});
	});
});
