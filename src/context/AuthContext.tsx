import { createContext, useContext, useState } from "react";

const AuthContext = createContext<AuthContextType | null>(null);

interface LoginInfos {
	email: string;
	password: string;
}

interface User {
	id: number;
	email: string;
	role: string;
}

// décrit ce qu'il va se passer pour l'utilisateur

interface AuthContextType {
	user: User | null; // l'utilisateur connecté, ou null si déconnecté
	login: (infos: LoginInfos) => Promise<void>; // fonction pour se connecter
	logout: () => void; // fonction pour se déconnecter
}

export default function AuthProvider({ children }) {
	const [user, setUser] = useState<User | null>(null);

	const handleLogin = async (infos: LoginInfos) => {
		const newData = { email: infos.email, password: infos.password };

		const response = await fetch("http://localhost:3310/api/auth/signin", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(newData),
		});

		const data = await response.json();
		if (response.ok) {
			setUser(user);
		}
	};

	const handleSignup = async (infos: LoginInfos) => {};

	const handleLogout = () => setUser(null);

	return (
		<AuthContext value={{ user, handleLogin, handleLogout, handleSignup }}>
			{children}
		</AuthContext>
	);
}
