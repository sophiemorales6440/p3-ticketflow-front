import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAuth } from "../../../context/AuthContext";
import Login from "../Login";

// Mock du hook useAuth
vi.mock("../../../context/AuthContext", () => ({
	useAuth: vi.fn(),
}));

// Mock de react-router-dom navigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
	const actual = await vi.importActual("react-router-dom");
	return {
		...actual,
		useNavigate: () => mockNavigate,
	};
});

const mockUseAuth = vi.mocked(useAuth);

function renderLogin() {
	return render(
		<MemoryRouter>
			<Login />
		</MemoryRouter>,
	);
}

describe("Login", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("affiche le titre TICKETFLOW", () => {
		mockUseAuth.mockReturnValue({
			handleLogin: vi.fn(),
			handleLogout: vi.fn(),
			user: null,
			isLoading: false,
		});

		renderLogin();
		expect(screen.getByText("TICKETFLOW")).toBeInTheDocument();
	});

	it("affiche le bouton Sign in", () => {
		mockUseAuth.mockReturnValue({
			handleLogin: vi.fn(),
			handleLogout: vi.fn(),
			user: null,
			isLoading: false,
		});

		renderLogin();
		expect(
			screen.getByRole("button", { name: /sign in/i }),
		).toBeInTheDocument();
	});

	it("affiche un message d'erreur si la connexion échoue", async () => {
		mockUseAuth.mockReturnValue({
			handleLogin: vi.fn().mockRejectedValueOnce(new Error("Erreur")),
			handleLogout: vi.fn(),
			user: null,
			isLoading: false,
		});

		renderLogin();

		await userEvent.type(screen.getByLabelText(/email/i), "test@test.com");
		await userEvent.type(screen.getByLabelText(/password/i), "mauvais");
		await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

		await waitFor(() => {
			expect(
				screen.getByText("Impossible de se connecter"),
			).toBeInTheDocument();
		});
	});

	it("redirige vers /admin/dashboard si role admin", async () => {
		mockUseAuth.mockReturnValue({
			handleLogin: vi.fn().mockResolvedValueOnce({
				id: 1,
				role: "admin",
				email: "admin@test.com",
				firstname: "Alice",
				lastname: "Martin",
			}),
			handleLogout: vi.fn(),
			user: null,
			isLoading: false,
		});

		renderLogin();

		await userEvent.type(screen.getByLabelText(/email/i), "admin@test.com");
		await userEvent.type(screen.getByLabelText(/password/i), "password");
		await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

		await waitFor(() => {
			expect(mockNavigate).toHaveBeenCalledWith("/admin/dashboard");
		});
	});

	it("redirige vers /technician/dashboard si role technician", async () => {
		mockUseAuth.mockReturnValue({
			handleLogin: vi.fn().mockResolvedValueOnce({
				id: 2,
				role: "technician",
				email: "tech@test.com",
				firstname: "Bob",
				lastname: "Dupont",
			}),
			handleLogout: vi.fn(),
			user: null,
			isLoading: false,
		});

		renderLogin();

		await userEvent.type(screen.getByLabelText(/email/i), "tech@test.com");
		await userEvent.type(screen.getByLabelText(/password/i), "password");
		await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

		await waitFor(() => {
			expect(mockNavigate).toHaveBeenCalledWith("/technician/dashboard");
		});
	});

	it("redirige vers /client/dashboard si role client", async () => {
		mockUseAuth.mockReturnValue({
			handleLogin: vi.fn().mockResolvedValueOnce({
				id: 3,
				role: "client",
				email: "client@test.com",
				firstname: "Claire",
				lastname: "Durand",
			}),
			handleLogout: vi.fn(),
			user: null,
			isLoading: false,
		});

		renderLogin();

		await userEvent.type(screen.getByLabelText(/email/i), "client@test.com");
		await userEvent.type(screen.getByLabelText(/password/i), "password");
		await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

		await waitFor(() => {
			expect(mockNavigate).toHaveBeenCalledWith("/client/dashboard");
		});
	});

	it("toggle la visibilité du mot de passe", async () => {
		mockUseAuth.mockReturnValue({
			handleLogin: vi.fn(),
			handleLogout: vi.fn(),
			user: null,
			isLoading: false,
		});

		renderLogin();

		const passwordInput = screen.getByLabelText(/password/i);
		expect(passwordInput).toHaveAttribute("type", "password");

		const toggleButton = screen.getByRole("button", { name: "" });
		await userEvent.click(toggleButton);

		expect(passwordInput).toHaveAttribute("type", "text");
	});
});
