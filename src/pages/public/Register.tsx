import {
	GitHub as GitHubIcon,
	Google as GoogleIcon,
	Visibility,
	VisibilityOff,
} from "@mui/icons-material";
import {
	Box,
	Button,
	Divider,
	IconButton,
	InputAdornment,
	LinearProgress,
	Paper,
	TextField,
	Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/ui/Footer";
import {
	type FormErrors,
	getPasswordStrength,
	inputSx,
	strengthColors,
	strengthLabel,
	validateForm,
} from "./registerForm.utils";

export default function Register() {
	const [firstname, setFirstname] = useState("");
	const [lastname, setLastname] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [errors, setErrors] = useState<FormErrors>({});
	const navigate = useNavigate();

	const score = getPasswordStrength(password);

	const handleSubmit = async (event: { preventDefault: () => void }) => {
		event.preventDefault();
		const formErrors = validateForm(
			firstname,
			lastname,
			email,
			password,
			confirmPassword,
		);
		if (Object.keys(formErrors).length > 0) {
			setErrors(formErrors);
			return;
		}
		setErrors({});
		setIsSubmitting(true);
		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/api/auth/signup`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						firstname,
						lastname,
						email,
						password,
					}),
				},
			);
			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || "Registration failed");
			}
			navigate("/login");
		} catch (error) {
			console.error("Registration error:", error);
		} finally {
			setIsSubmitting(false);
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
			<Typography variant="h5" fontWeight={800} color="white" letterSpacing={1}>
				TICKETFLOW
			</Typography>

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
						maxWidth: 480,
						borderRadius: 3,
						bgcolor: "rgba(255,255,255,0.15)",
						backdropFilter: "blur(12px)",
						border: "1px solid rgba(255,255,255,0.2)",
					}}
				>
					<Typography
						variant="h5"
						fontWeight={700}
						textAlign="center"
						color="white"
						mb={0.5}
					>
						Create your account
					</Typography>
					<Typography
						variant="body2"
						color="rgba(255,255,255,0.6)"
						textAlign="center"
						mb={3}
					>
						Already have an account?{" "}
						<Typography
							component="span"
							variant="body2"
							color="white"
							fontWeight={600}
							sx={{ cursor: "pointer", textDecoration: "underline" }}
							onClick={() => navigate("/login")}
						>
							Sign in
						</Typography>
					</Typography>

					<Box sx={{ display: "flex", gap: 2, mb: 2 }}>
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

					<Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.2)" }}>
						<Typography variant="caption" color="rgba(255,255,255,0.6)">
							or register with email
						</Typography>
					</Divider>

					<Box component="form" onSubmit={handleSubmit} noValidate>
						<Box sx={{ display: "flex", gap: 2, mb: 2 }}>
							<TextField
								label="First name"
								fullWidth
								value={firstname}
								onChange={(e) => setFirstname(e.target.value)}
								error={!!errors.firstname}
								helperText={errors.firstname}
								sx={inputSx}
							/>
							<TextField
								label="Last name"
								fullWidth
								value={lastname}
								onChange={(e) => setLastname(e.target.value)}
								error={!!errors.lastname}
								helperText={errors.lastname}
								sx={inputSx}
							/>
						</Box>

						<TextField
							label="Email address"
							type="email"
							fullWidth
							sx={{ mb: 2, ...inputSx }}
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							error={!!errors.email}
							helperText={errors.email}
						/>

						<TextField
							fullWidth
							label="Password"
							type={showPassword ? "text" : "password"}
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							error={!!errors.password}
							helperText={errors.password || "Min. 8 characters"}
							sx={{ mb: 1, ...inputSx }}
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

						{password.length > 0 && (
							<Box sx={{ mb: 2 }}>
								<LinearProgress
									variant="determinate"
									value={(score / 4) * 100}
									color={strengthColors[score]}
									sx={{ borderRadius: 2, height: 6 }}
								/>
								<Typography
									variant="caption"
									color={`${strengthColors[score]}.main`}
									sx={{ mt: 0.5, display: "block" }}
								>
									{strengthLabel[score]}
								</Typography>
							</Box>
						)}

						<TextField
							label="Confirm password"
							type="password"
							fullWidth
							sx={{ mb: 3, ...inputSx }}
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							error={!!errors.confirmPassword}
							helperText={errors.confirmPassword}
						/>

						<Button
							type="submit"
							variant="contained"
							fullWidth
							size="large"
							disabled={isSubmitting}
							sx={{ textTransform: "none", fontWeight: 600 }}
						>
							{isSubmitting ? "Creating account..." : "Create account"}
						</Button>
					</Box>
				</Paper>
			</Box>
			<Footer />
		</Box>
	);
}
