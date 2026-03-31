import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext<AuthContextType | null>(null);

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

// décrit ce qu'il va se passer pour l'utilisateur
interface AuthContextType {
	user: User | null; // l'utilisateur connecté, ou null si déconnecté
	handleLogin: (infos: LoginInfos) => Promise<User>; // fonction pour se connecter
	handleLogout: () => void; // fonction pour se déconnecter
}

export default function AuthProvider({
	children,
}: {
	children: React.ReactNode;
}) {
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
	}, []);

	const [user, setUser] = useState<User | null>(null);

	const handleLogin = async (infos: LoginInfos): Promise<User> => {
		const newData = { email: infos.email, password: infos.password };

		const response = await fetch("http://localhost:3310/api/auth/signin", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(newData),
		});
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
		<AuthContext value={{ user, handleLogin, handleLogout }}>
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
