import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useEffect, useState } from "react";

interface LoginInfos {
	email: string;
	password: string;
}

interface User {
	id: number;
	email: string;
	role: string;
	firstname: string;
	lastname: string;
}

interface AuthContextType {
	user: User | null;
	isLoading: boolean;
	handleLogin: (infos: LoginInfos) => Promise<User>;
	handleLogout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const token = localStorage.getItem("token");

		if (token) {
			try {
				const decoded = jwtDecode<User>(token);
				setUser({
					id: decoded.id,
					email: decoded.email,
					role: decoded.role,
					firstname: decoded.firstname,
					lastname: decoded.lastname,
				});
			} catch (error) {
				console.error("Token invalide :", error);
				localStorage.removeItem("token");
			}
		}

		setIsLoading(false);
	}, []);

	const handleLogin = async (infos: LoginInfos): Promise<User> => {
		const newData = { email: infos.email, password: infos.password };

		const response = await fetch(
			`${import.meta.env.VITE_API_URL}/api/auth/signin`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(newData),
			},
		);

		if (!response.ok) {
			throw new Error("fonctionne pas");
		}

		const data = await response.json();
		setUser(data.userDTO);
		localStorage.setItem("token", data.token);
		return data.userDTO;
	};

	const handleLogout = () => {
		setUser(null);
		localStorage.removeItem("token");
	};

	return (
		<AuthContext value={{ user, isLoading, handleLogin, handleLogout }}>
			{children}
		</AuthContext>
	);
}

export const useAuth = () => {
	const context = useContext(AuthContext);

	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}

	return context;
};
