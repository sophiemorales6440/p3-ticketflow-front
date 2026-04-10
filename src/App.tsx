import Box from "@mui/material/Box";
import { Navigate, Route, Routes } from "react-router-dom";
import Background from "./assets/background.webp";
import Layout from "./components/ui/Layout";
import { useAuth } from "./context/AuthContext";
import About from "./pages/About";
import Categories from "./pages/admin/Categories";
import Dashboard from "./pages/admin/Dashboard";
import Statistics from "./pages/admin/Statistics";
import Technicians from "./pages/admin/Technicians";
import TicketEdit from "./pages/admin/TicketEdit";
import TicketForm from "./pages/admin/TicketForm";
import Tickets from "./pages/admin/Tickets";
import Users from "./pages/admin/Users";
import ClientDashboard from "./pages/clients/ClientDashboard";
import ProfilePage from "./pages/profile/ProfilePage";
import Login from "./pages/public/Login";
import Register from "./pages/public/Register";
import TechnicienDashboard from "./pages/technicien/TechnicienDashboard";

function AppRoutes() {
	const { user } = useAuth();

	if (!user) {
		return (
			<Routes>
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route path="*" element={<Navigate to="/login" />} />
			</Routes>
		);
	}

	return (
		<Layout>
			<Routes>
				<Route path="/about" element={<About />} />
				<Route path="/tickets/new" element={<TicketForm />} />
				<Route path="/tickets/:id/edit" element={<TicketEdit />} />
				<Route path="/tickets" element={<Tickets />} />
				<Route path="/users" element={<Users />} />
				<Route path="/technicians" element={<Technicians />} />
				<Route path="/categories" element={<Categories />} />
				<Route path="/profile" element={<ProfilePage />} />
				<Route path="/admin/dashboard" element={<Dashboard />} />
				<Route path="/technician/dashboard" element={<TechnicienDashboard />} />
				<Route path="/client/dashboard" element={<ClientDashboard />} />
				<Route path="/statistics" element={<Statistics />} />
				<Route
					path="*"
					element={
						<Navigate
							to={
								user.role === "admin"
									? "/admin/dashboard"
									: user.role === "technician"
										? "/technician/dashboard"
										: "/client/dashboard"
							}
						/>
					}
				/>
			</Routes>
		</Layout>
	);
}

export default function App() {
	return (
		<Box
			sx={{
				minHeight: "100vh",
				backgroundImage: `url(${Background})`,
				backgroundSize: "cover",
				backgroundPosition: "center",
				color: "#fff",
			}}
		>
			<AppRoutes />
		</Box>
	);
}
