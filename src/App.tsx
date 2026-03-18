import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Navigate, Route, Link as RouterLink, Routes } from "react-router-dom";
import Background from "./assets/background.webp";
import About from "./pages/About";
import Categories from "./pages/admin/Categories";
import Comments from "./pages/admin/Comments";
import Dashboard from "./pages/admin/Dashboard";
import TicketForm from "./pages/admin/TicketForm";
import Users from "./pages/admin/Users";
import Login from "./pages/public/Login";
import Register from "./pages/public/Register";

function Copyright() {
	return (
		<Typography
			variant="body2"
			align="center"
			sx={{
				color: "white",
			}}
		>
			{"Copyright © "}
			<Link color="inherit" href="https://mui.com/">
				Your Website
			</Link>
			{new Date().getFullYear()}.
		</Typography>
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
			<Container maxWidth="sm">
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
							Accueil
						</Link>
						{/*<Link
						component={RouterLink}
						to="/login"
						variant="h6"
						underline="hover"
						color="white"
					>
						Login
					</Link>
					*/}
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
					{/* public routes */}
					<Route path="/" element={<Navigate to="/login" />} />
					<Route path="/about" element={<About />} />
					<Route path="/users" element={<Users />} />
					<Route path="/comments" element={<Comments />} />
					<Route path="/categories" element={<Categories />} />
					{/* Only for Admins/tech */}
					<Route path="/dashboard" element={<Dashboard />} />
					<Route path="/tickets/new" element={<TicketForm />} />
				</Routes>

				<Box sx={{ my: 4 }}>
					<Copyright />
				</Box>
			</Container>
		</Box>
	);
}
