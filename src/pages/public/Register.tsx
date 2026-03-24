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
	Link,
	Paper,
	TextField,
	Typography,
} from "@mui/material";

import { useState } from "react";

interface FormErrors {
	firstname?: string;
	lastname?: string;
	email?: string;
	password?: string;
	confirmPassword?: string;
}

export default function Register() {
	const [firstname, setFirstname] = useState("");
	const [lastname, setLastname] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [errors, setErrors] = useState<FormErrors>({});

	const getPasswordStrength = (myPassword: string) => {
		let score = 0;
		if (myPassword.length >= 8) score++;
		if (/[0-9]/.test(myPassword)) score++;
		if (/[^a-zA-Z0-9]/.test(myPassword)) score++;
		if (myPassword.length >= 12) score++;
		return score;
	};

	const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"];
	const strengthColors: ("error" | "warning" | "info" | "success")[] = [
		"error",
		"warning",
		"info",
		"success",
	];
	const score = getPasswordStrength(password);

	const validationPassword = (): FormErrors => {
		const strongPassword: FormErrors = {};
		if (!firstname.trim()) strongPassword.firstname = "Required";
		if (!lastname.trim()) strongPassword.lastname = "Required";
		if (!email) strongPassword.email = "Email is required";
		else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
			strongPassword.email = "Invalid email";
		if (!password) strongPassword.password = "Required";
		else if (password.length < 8) strongPassword.password = "Min. 8 characters";
		else if (confirmPassword !== password)
			strongPassword.confirmPassword = "Password do not match";
		return strongPassword;
	};

	const handleSubmit = async (event: { preventDefault: () => void }) => {
		event.preventDefault();
		const formErrors = validationPassword();
		if (Object.keys(formErrors).length > 0) {
			setErrors(formErrors);
			return;
		}

		setErrors({});
		setIsSubmitting(true);
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
				<Typography variant="h5" fontWeight={700} textAlign="center" mb={0.5}>
					Create your account
				</Typography>
				<Typography
					variant="body2"
					color="text.secondary"
					textAlign="center"
					mb={3}
				>
					Already have an account?{" "}
					<Link href="/login" underline="hover">
						Sign in
					</Link>
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
						or register with email
					</Typography>
				</Divider>

				<Box component="form" onSubmit={handleSubmit} noValidate>
					{/* First name + Last name */}
					<Box sx={{ display: "flex", gap: 2, mb: 2 }}>
						<TextField
							label="First name"
							fullWidth
							value={firstname}
							onChange={(event) => setFirstname(event.target.value)}
							error={!!errors.firstname}
							helperText={errors.firstname}
						/>
						<TextField
							label="Last name"
							fullWidth
							value={lastname}
							onChange={(event) => setLastname(event.target.value)}
							error={!!errors.lastname}
							helperText={errors.lastname}
						/>
					</Box>

					{/* Email */}
					<TextField
						label="Email address"
						type="email"
						fullWidth
						sx={{ mb: 2 }}
						value={email}
						onChange={(event) => setEmail(event.target.value)}
						error={!!errors.email}
						helperText={errors.email}
					/>

					{/* TextField: password with InputAdornment (show/hide toggle) */}
					<TextField
						fullWidth
						label="Password"
						name="password"
						type={showPassword ? "text" : "password"}
						value={password}
						onChange={(event) => setPassword(event.target.value)}
						error={!!errors.password}
						helperText={errors.password || "Min. 8 characters"}
						sx={{ mb: 1 }}
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

					{/* Password strength bar */}
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

					{/* Confirm Password */}
					<TextField
						label="Confirm password"
						type="password"
						fullWidth
						sx={{ mb: 3 }}
						value={confirmPassword}
						onChange={(event) => setConfirmPassword(event.target.value)}
						error={!!errors.confirmPassword}
						helperText={errors.confirmPassword}
					/>

					{/* Submit */}
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
	);
}
