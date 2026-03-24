import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import { Navigate, Route, Link as RouterLink, Routes } from "react-router-dom";
import Background from "./assets/background.webp";
import Footer from "./components/ui/Footer";
import About from "./pages/About";
import Categories from "./pages/admin/Categories";
import Comments from "./pages/admin/Comments";
import Dashboard from "./pages/admin/Dashboard";
import TicketEdit from "./pages/admin/TicketEdit";
import TicketForm from "./pages/admin/TicketForm";
import Tickets from "./pages/admin/Tickets";
import Users from "./pages/admin/Users";
import Login from "./pages/public/Login";
import Register from "./pages/public/Register";

export default function App() {
	return (
		<Box
			sx={{
				minHeight: "100vh",
				backgroundImage: `url(${Background})`,
				backgroundSize: "cover",
				backgroundPosition: "center",
				color: "#fff",
				display: "flex",
				flexDirection: "column",
			}}
		>
			<Container maxWidth="lg" sx={{ flexGrow: 1 }}>
				{/* Barre de navigation simple */}
				<Box component="nav" sx={{ p: 2, borderBottom: "1px solid #ddd" }}>
					<Stack direction="row" spacing={4} justifyContent="center">
						<Link
							component={RouterLink}
							to="/"
							variant="h6"
							underline="hover"
							color="white"
						>
							Login
						</Link>
						<Link
							component={RouterLink}
							to="/register"
							variant="h6"
							underline="hover"
							color="white"
						>
							Register
						</Link>
						<Link
							component={RouterLink}
							to="/about"
							variant="h6"
							underline="hover"
							color="white"
						>
							À propos
						</Link>
						<Link
							component={RouterLink}
							to="/users"
							variant="h6"
							underline="hover"
							color="white"
						>
							Users
						</Link>
						<Link
							component={RouterLink}
							to="/comments"
							variant="h6"
							underline="hover"
							color="white"
						>
							Commentaires
						</Link>
					</Stack>
				</Box>

				{/* Configuration des Routes */}
				<Routes>
					{/* public routes */}
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
					<Route path="/tickets/new" element={<TicketForm />} />
					{/* public routes */}
					<Route path="/" element={<Navigate to="/login" />} />
					<Route path="/about" element={<About />} />
					<Route path="/users" element={<Users />} />
					<Route path="/comments" element={<Comments />} />
					<Route path="/categories" element={<Categories />} />
					{/* Only for Admins/tech */}
					<Route path="/admin/dashboard" element={<Dashboard />} />
					<Route path="/tickets" element={<Tickets />} />
					<Route path="/tickets/:id/edit" element={<TicketEdit />} />
				</Routes>
			</Container>
			<Footer />
		</Box>
	);
}
