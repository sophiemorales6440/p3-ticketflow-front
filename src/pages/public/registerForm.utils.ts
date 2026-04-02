export interface FormErrors {
	firstname?: string;
	lastname?: string;
	email?: string;
	password?: string;
	confirmPassword?: string;
}

export const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"];

export const strengthColors: ("error" | "warning" | "info" | "success")[] = [
	"error",
	"warning",
	"info",
	"success",
];

export const getPasswordStrength = (myPassword: string) => {
	let score = 0;
	if (myPassword.length >= 8) score++;
	if (/[0-9]/.test(myPassword)) score++;
	if (/[^a-zA-Z0-9]/.test(myPassword)) score++;
	if (myPassword.length >= 12) score++;
	return score;
};

export const validateForm = (
	firstname: string,
	lastname: string,
	email: string,
	password: string,
	confirmPassword: string,
): FormErrors => {
	const errors: FormErrors = {};
	if (!firstname.trim()) errors.firstname = "Required";
	if (!lastname.trim()) errors.lastname = "Required";
	if (!email) errors.email = "Email is required";
	else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
		errors.email = "Invalid email";
	if (!password) errors.password = "Required";
	else if (password.length < 8) errors.password = "Min. 8 characters";
	else if (confirmPassword !== password)
		errors.confirmPassword = "Password do not match";
	return errors;
};

export const inputSx = {
	"& .MuiOutlinedInput-root": {
		bgcolor: "rgba(255,255,255,0.1)",
		color: "white",
		"& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
		"&:hover fieldset": { borderColor: "rgba(255,255,255,0.6)" },
		"&.Mui-focused fieldset": { borderColor: "white" },
	},
	"& .MuiInputLabel-root": { color: "rgba(255,255,255,0.7)" },
	"& .MuiInputLabel-root.Mui-focused": { color: "white" },
	"& .MuiFormHelperText-root": { color: "rgba(255,255,255,0.5)" },
};
