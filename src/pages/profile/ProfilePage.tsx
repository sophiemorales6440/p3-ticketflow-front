import {
	Avatar,
	Box,
	Button,
	Paper,
	TextField,
	Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { fetchWithToken } from "../../utils/api";

interface UserInfos {
	id: number;
	firstname: string;
	lastname: string;
	email: string;
	role: string;
}

export default function ProfilePage() {
	const { user } = useAuth();
	const [userInfos, setUserInfos] = useState<UserInfos | null>(null);
	const [firstname, setFirstname] = useState("");
	const [lastname, setLastname] = useState("");
	const [email, setEmail] = useState("");
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState("");
	const navigate = useNavigate();
	useEffect(() => {
		if (!user?.id) return;
		fetchWithToken(`http://localhost:3310/api/users/${user.id}`)
			.then((res) => res.json())
			.then((data: UserInfos) => {
				setUserInfos(data);
				setFirstname(data.firstname);
				setLastname(data.lastname);
				setEmail(data.email);
			})
			.catch(() => setError("Impossible de charger le profil"));
	}, [user]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSuccess(false);
		setError("");

		const response = await fetchWithToken(
			`http://localhost:3310/api/users/${user?.id}`,
			{
				method: "PUT",
				body: JSON.stringify({ firstname, lastname, email }),
			},
		);

		if (response.ok) {
			setSuccess(true);
			setTimeout(() => navigate(-1), 1500);
		} else {
			setError("Erreur lors de la mise à jour");
		}
	};

	if (!userInfos) return null;

	return (
		<Box sx={{ maxWidth: 600, mx: "auto", py: 4 }}>
			<Typography variant="h5" fontWeight={600} mb={3}>
				Mon profil
			</Typography>

			<Paper
				elevation={0}
				sx={{
					p: 4,
					borderRadius: 3,
					border: "1px solid",
					borderColor: "divider",
				}}
			>
				{/* Avatar + rôle */}
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						gap: 2,
						mb: 4,
					}}
				>
					<Avatar
						sx={{
							width: 64,
							height: 64,
							bgcolor: "primary.main",
							fontSize: 24,
						}}
					>
						{userInfos.firstname[0]}
						{userInfos.lastname[0]}
					</Avatar>
					<Box>
						<Typography variant="h6" fontWeight={600}>
							{userInfos.firstname} {userInfos.lastname}
						</Typography>
						<Typography variant="body2" color="text.secondary">
							{userInfos.role === "admin"
								? "Administrateur"
								: userInfos.role === "technician"
									? "Technicien"
									: "Client"}
						</Typography>
					</Box>
				</Box>

				{/* Formulaire */}
				<Box component="form" onSubmit={handleSubmit}>
					<Box sx={{ display: "flex", gap: 2, mb: 2 }}>
						<TextField
							label="Prénom"
							fullWidth
							value={firstname}
							onChange={(e) => setFirstname(e.target.value)}
						/>
						<TextField
							label="Nom"
							fullWidth
							value={lastname}
							onChange={(e) => setLastname(e.target.value)}
						/>
					</Box>

					<TextField
						label="Email"
						type="email"
						fullWidth
						sx={{ mb: 3 }}
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>

					{success && (
						<Typography color="success.main" mb={2}>
							Profil mis à jour avec succès !
						</Typography>
					)}

					{error && (
						<Typography color="error.main" mb={2}>
							{error}
						</Typography>
					)}

					<Button
						type="submit"
						variant="contained"
						fullWidth
						size="large"
						sx={{ textTransform: "none", fontWeight: 600 }}
					>
						Enregistrer les modifications
					</Button>
				</Box>
			</Paper>
		</Box>
	);
}
