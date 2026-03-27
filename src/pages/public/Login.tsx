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
			const userData = await handleLogin({ email: email, password: password });
			if (userData.role === "admin" || userData.role === "technician") {
				navigate("/admin/dashboard");
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
				minHeight: "85vh",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				p: 2,
			}}
		>
			<Paper
				elevation={3}
				sx={{ p: 4, width: "100%", maxWidth: 480, borderRadius: 3 }}
			>
				{/* Header */}
				<Typography variant="h5" fontWeight={700} textAlign="center" mb={4}>
					Se connecter à votre compte
				</Typography>

				{/* OAuth Buttons */}
				<Box sx={{ display: "flex", gap: 2, mb: 2 }}>
					<Button
						fullWidth
						variant="outlined"
						startIcon={<GoogleIcon />}
						sx={{ textTransform: "none" }}
					>
						Google
					</Button>
					<Button
						fullWidth
						variant="outlined"
						startIcon={<GitHubIcon />}
						sx={{ textTransform: "none" }}
					>
						GitHub
					</Button>
				</Box>

				{/* Divider */}
				<Divider sx={{ my: 2 }}>
					<Typography variant="caption" color="text.secondary">
						ou se connecter avec votre email
					</Typography>
				</Divider>

				{error && <Alert severity="error">{error}</Alert>}

				<Box component="form" onSubmit={handleSubmit} noValidate>
					{/* Email */}
					<TextField
						label="Email address"
						type="email"
						fullWidth
						sx={{ mb: 2 }}
						value={email}
						onChange={(event) => setEmail(event.target.value)}
					/>
					<TextField
						fullWidth
						label="Password"
						name="password"
						type={showPassword ? "text" : "password"}
						value={password}
						onChange={(event) => setPassword(event.target.value)}
						sx={{ mb: 4 }}
						InputProps={{
							endAdornment: (
								// InputAdornment + IconButton: the eye icon inside the input
								<InputAdornment position="end">
									<IconButton
										onClick={() => setShowPassword((p) => !p)}
										edge="end"
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
						sx={{ textTransform: "none", fontWeight: 600 }}
					>
						{loading ? "Connexion..." : "Se connecter"}
					</Button>
				</Box>
			</Paper>
		</Box>
	);
}
