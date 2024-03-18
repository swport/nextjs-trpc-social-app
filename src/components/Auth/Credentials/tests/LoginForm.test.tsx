import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import LoginForm from "../LoginForm";

// Mock useCsrfTokenAtom
jest.mock("@/store/csrf", () => ({
	useCsrfTokenAtom: jest.fn(() => ["random-token"]),
}));

describe("LoginForm", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		jest.spyOn(console, "error").mockImplementation(jest.fn());
		jest.spyOn(console, "log").mockImplementation(jest.fn());
		jest.spyOn(console, "warn").mockImplementation(jest.fn());
		jest.spyOn(console, "info").mockImplementation(jest.fn());
	});

	afterAll(() => {
		jest.restoreAllMocks();
	});

	it("should render the component", () => {
		const onLoginComplete = jest.fn();

		render(<LoginForm onLoginComplete={onLoginComplete} />);

		expect(screen.getByTestId("auth-credentials")).toBeInTheDocument();
	});

	it("should submit the form and call onLoginComplete", async () => {
		jest.spyOn(global, "fetch").mockImplementation(() =>
			Promise.resolve({
				ok: true,
				status: 200,
				json: () => Promise.resolve(),
			} as Response)
		);

		const onLoginComplete = jest.fn(() => []);

		render(<LoginForm onLoginComplete={onLoginComplete} />);

		const emailInput = screen.getByLabelText("Email address");
		const passwordInput = screen.getByLabelText("Password");
		const submitButton = screen.getByText("Submit");

		fireEvent.change(emailInput, { target: { value: "test@example.com" } });
		fireEvent.change(passwordInput, { target: { value: "password123" } });

		fireEvent.click(submitButton);

		// Wait for the fetch to complete
		await waitFor(() => {
			expect(global.fetch).toHaveBeenCalledWith("/api/auth/callback/credentials", {
				method: "post",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: expect.any(URLSearchParams),
			});
		});

		// Verify that onLoginComplete was called
		expect(onLoginComplete).toHaveBeenCalled();
	});

	it("should display an error message on unsuccessful login", async () => {
		jest.spyOn(global, "fetch").mockImplementation(() =>
			Promise.resolve({
				ok: false,
				status: 403,
			} as Response)
		);

		const onLoginComplete = jest.fn();

		render(<LoginForm onLoginComplete={onLoginComplete} />);

		const emailInput = screen.getByLabelText("Email address");
		const passwordInput = screen.getByLabelText("Password");
		const submitButton = screen.getByText("Submit");

		fireEvent.change(emailInput, { target: { value: "test@example.com" } });
		fireEvent.change(passwordInput, { target: { value: "password123" } });

		fireEvent.click(submitButton);

		// Wait for the fetch to complete
		await waitFor(() => {
			expect(global.fetch).toHaveBeenCalledWith("/api/auth/callback/credentials", {
				method: "post",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: expect.any(URLSearchParams),
			});
		});

		// Verify that the error message is displayed
		expect(screen.getByText("Invalid email/password. Please try again.")).toBeInTheDocument();
	});

	it("should handle csrf error in the url", async () => {
		global.fetch = jest.fn().mockImplementationOnce(() =>
			Promise.resolve({
				ok: true,
				status: 200,
				json: () => Promise.resolve({ url: "http://some.url/?csrf=true" }),
			})
		);

		const onLoginComplete = jest.fn();

		render(<LoginForm onLoginComplete={onLoginComplete} />);
		const emailInput = screen.getByLabelText("Email address");
		const passwordInput = screen.getByLabelText("Password");
		const submitButton = screen.getByText("Submit");

		fireEvent.change(emailInput, { target: { value: "test@example.com" } });
		fireEvent.change(passwordInput, { target: { value: "password123" } });

		fireEvent.click(submitButton);

		// Wait for the fetch to complete
		await waitFor(() => {
			expect(global.fetch).toHaveBeenCalledWith("/api/auth/callback/credentials", {
				method: "post",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: expect.any(URLSearchParams),
			});
		});

		await waitFor(() => {
			// Verify that the error message is displayed
			expect(
				screen.getByText("Something went wrong at the server. Please try again by refreshing the page.")
			).toBeInTheDocument();
		});
	});
});
