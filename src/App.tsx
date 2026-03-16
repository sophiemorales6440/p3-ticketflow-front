import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Route, Link as RouterLink, Routes } from "react-router-dom";
import About from "./pages/About";
import Categories from "./pages/admin/Categories";
import Users from "./pages/admin/Users";
import Home from "./pages/Home";
import Login from "./pages/public/Login";
import Register from "./pages/public/Register";

function Copyright() {
	return (
		<Typography
			variant="body2"
			align="center"
			sx={{
				color: "text.secondary",
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
		<Container maxWidth="sm">
			{/* Barre de navigation simple */}
			<Box component="nav" sx={{ p: 2, borderBottom: "1px solid #ddd" }}>
				<Stack direction="row" spacing={4} justifyContent="center">
					<Link component={RouterLink} to="/" variant="h6" underline="hover">
						Accueil
					</Link>
					<Link
						component={RouterLink}
						to="/login"
						variant="h6"
						underline="hover"
					>
						Login
					</Link>
					<Link
						component={RouterLink}
						to="/register"
						variant="h6"
						underline="hover"
					>
						Register
					</Link>
					<Link
						component={RouterLink}
						to="/about"
						variant="h6"
						underline="hover"
					>
						À propos
					</Link>
					<Link
						component={RouterLink}
						to="/users"
						variant="h6"
						underline="hover"
					>
						Users
					</Link>
				</Stack>
			</Box>

			{/* Configuration des Routes */}
			<Routes>
				{/* public routes */}
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				{/* public routes */}
				<Route path="/" element={<Home />} />
				<Route path="/about" element={<About />} />
				<Route path="/users" element={<Users />} />
				<Route path="/categories" element={<Categories />} />
			</Routes>

			<Box sx={{ my: 4 }}>
				<Copyright />
			</Box>
		</Container>
	);
}
