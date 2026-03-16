import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null)

interface LoginInfos {
    email: string;
    password: string
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
    const [isLogin, setIsLogin] = useState(false)
    
    return (
        <div>AuthContext</div>
    )
}