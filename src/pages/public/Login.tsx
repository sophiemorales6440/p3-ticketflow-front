import {
	GitHub as GitHubIcon,
	Google as GoogleIcon,
	Visibility,
	VisibilityOff,
} from "@mui/icons-material";
import {
	Alert,
	Box,
	Button,
	Divider,
	IconButton,
	InputAdornment,
	Paper,
	TextField,
	Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/ui/Footer";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const { handleLogin } = useAuth();
	const navigate = useNavigate();

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		setError("");
		setLoading(true);

		try {
			const userData = await handleLogin({ email, password });
			if (userData.role === "admin") {
				navigate("/admin/dashboard");
			} else if (userData.role === "technician") {
				navigate("/technician/dashboard");
			} else {
				navigate("/client/dashboard");
			}
		} catch (_error) {
			setError("Impossible de se connecter");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Box
			sx={{
				minHeight: "100vh",
				display: "flex",
				flexDirection: "column",
				p: 3,
			}}
		>
			{/* Logo */}
			<Typography variant="h5" fontWeight={800} color="white" letterSpacing={1}>
				TICKETFLOW
			</Typography>

			{/* Carte login centrée */}
			<Box
				sx={{
					flex: 1,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<Paper
					elevation={0}
					sx={{
						p: 4,
						width: "100%",
						maxWidth: 420,
						borderRadius: 3,
						bgcolor: "rgba(255,255,255,0.15)",
						backdropFilter: "blur(12px)",
						border: "1px solid rgba(255,255,255,0.2)",
					}}
				>
					{/* Header */}
					<Typography
						variant="h5"
						fontWeight={700}
						textAlign="center"
						color="white"
						mb={4}
					>
						Login
					</Typography>

					{error && (
						<Alert severity="error" sx={{ mb: 2 }}>
							{error}
						</Alert>
					)}

					<Box component="form" onSubmit={handleSubmit} noValidate>
						{/* Email */}
						<TextField
							label="Email"
							type="email"
							fullWidth
							sx={{
								mb: 2,
								"& .MuiOutlinedInput-root": {
									bgcolor: "rgba(255,255,255,0.1)",
									color: "white",
									"& fieldset": {
										borderColor: "rgba(255,255,255,0.3)",
									},
									"&:hover fieldset": {
										borderColor: "rgba(255,255,255,0.6)",
									},
									"&.Mui-focused fieldset": {
										borderColor: "white",
									},
								},
								"& .MuiInputLabel-root": { color: "rgba(255,255,255,0.7)" },
								"& .MuiInputLabel-root.Mui-focused": { color: "white" },
							}}
							value={email}
							onChange={(event) => setEmail(event.target.value)}
						/>

						{/* Password */}
						<TextField
							fullWidth
							label="Password"
							type={showPassword ? "text" : "password"}
							value={password}
							onChange={(event) => setPassword(event.target.value)}
							sx={{
								mb: 3,
								"& .MuiOutlinedInput-root": {
									bgcolor: "rgba(255,255,255,0.1)",
									color: "white",
									"& fieldset": {
										borderColor: "rgba(255,255,255,0.3)",
									},
									"&:hover fieldset": {
										borderColor: "rgba(255,255,255,0.6)",
									},
									"&.Mui-focused fieldset": {
										borderColor: "white",
									},
								},
								"& .MuiInputLabel-root": { color: "rgba(255,255,255,0.7)" },
								"& .MuiInputLabel-root.Mui-focused": { color: "white" },
							}}
							InputProps={{
								endAdornment: (
									<InputAdornment position="end">
										<IconButton
											onClick={() => setShowPassword((p) => !p)}
											edge="end"
											sx={{ color: "rgba(255,255,255,0.7)" }}
										>
											{showPassword ? <VisibilityOff /> : <Visibility />}
										</IconButton>
									</InputAdornment>
								),
							}}
						/>

						<Button
							type="submit"
							variant="contained"
							fullWidth
							size="large"
							disabled={loading}
							sx={{ textTransform: "none", fontWeight: 600, mb: 2 }}
						>
							{loading ? "Connexion..." : "Sign in"}
						</Button>
					</Box>

					{/* Divider */}
					<Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.2)" }}>
						<Typography variant="caption" color="rgba(255,255,255,0.6)">
							or continue with
						</Typography>
					</Divider>

					{/* OAuth Buttons */}
					<Box sx={{ display: "flex", gap: 2 }}>
						<Button
							fullWidth
							variant="outlined"
							startIcon={<GoogleIcon />}
							sx={{
								textTransform: "none",
								color: "white",
								borderColor: "rgba(255,255,255,0.3)",
								"&:hover": { borderColor: "white" },
							}}
						>
							Google
						</Button>
						<Button
							fullWidth
							variant="outlined"
							startIcon={<GitHubIcon />}
							sx={{
								textTransform: "none",
								color: "white",
								borderColor: "rgba(255,255,255,0.3)",
								"&:hover": { borderColor: "white" },
							}}
						>
							GitHub
						</Button>
					</Box>

					{/* Lien register */}
					<Typography
						variant="caption"
						color="rgba(255,255,255,0.6)"
						textAlign="center"
						display="block"
						mt={2}
					>
						Don't have an account?{" "}
						<Typography
							component="span"
							variant="caption"
							color="white"
							fontWeight={600}
							sx={{ cursor: "pointer", textDecoration: "underline" }}
							onClick={() => navigate("/register")}
						>
							Register to You
						</Typography>
					</Typography>
				</Paper>
			</Box>
			<Footer />
		</Box>
	);
}
