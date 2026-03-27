import {
	Box,
	Card,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField,
	Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { fetchWithToken } from "../../utils/api";
import Profile from "./ProfileUser";
import User from "./UserCard";

interface UserType {
	id: number;
	firstname: string;
	lastname: string;
	email: string;
	password: string;
}

export default function Users() {
	const [users, setUsers] = useState<UserType[]>([]);
	const [currentUser, setCurrentUser] = useState<UserType | null>(null);
	const [isUpdate, SetIsUpdate] = useState(false);
	console.log(currentUser);
	const [search, setSearch] = useState(""); // State pour la recherche

	useEffect(() => {
		fetchWithToken("http://localhost:3310/api/users/")
			.then((response) => response.json())
			.then((data) => setUsers(data))
			.catch((error) => console.error(error));
	}, [isUpdate]);
	// Filtrer les utilisateurs en fonction de la recherche
	const filteredUsers = users.filter(
		(user) =>
			user.firstname.toLowerCase().includes(search.toLowerCase()) ||
			user.lastname.toLowerCase().includes(search.toLowerCase()) ||
			user.email.toLowerCase().includes(search.toLowerCase()),
	);
	return (
		<Box sx={{ p: 3 }}>
			<Typography variant="h4" gutterBottom>
				Gestion des utilisateurs
			</Typography>
			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: "1fr 1fr 1fr 1fr",
					gap: "12px",
					mb: 3,
				}}
			>
				<Card sx={{ p: 2, bgcolor: "#00FFD1", color: "white" }}>
					<Typography sx={{ fontSize: "11px", color: "text.secondary" }}>
						Utilisateurs
					</Typography>
					<Typography sx={{ fontSize: "26px", fontWeight: 700 }}>
						{users.length}
					</Typography>
					<Typography sx={{ fontSize: "11px", color: "text.disabled" }}>
						+ 3 ce mois
					</Typography>
				</Card>
				<Card sx={{ p: 2, bgcolor: "#FF6B6B", color: "white" }}>
					<Typography sx={{ fontSize: "11px", color: "text.secondary" }}>
						Ticket en cours
					</Typography>
					<Typography sx={{ fontSize: "26px", fontWeight: 700 }}>47</Typography>
					<Typography sx={{ fontSize: "11px", color: "text.disabled" }}>
						12 en attente
					</Typography>
				</Card>
				<Card sx={{ p: 2, bgcolor: "#FFD93D", color: "white" }}>
					<Typography sx={{ fontSize: "11px", color: "text.secondary" }}>
						Catégories
					</Typography>
					<Typography sx={{ fontSize: "26px", fontWeight: 700 }}>9</Typography>
					<Typography sx={{ fontSize: "11px", color: "text.disabled" }}>
						2 inactives
					</Typography>
				</Card>
				<Card sx={{ p: 2, bgcolor: "#A78BFA", color: "white" }}>
					<Typography sx={{ fontSize: "11px", color: "text.secondary" }}>
						Tickets résolus
					</Typography>
					<Typography sx={{ fontSize: "26px", fontWeight: 700 }}>
						203
					</Typography>
					<Typography sx={{ fontSize: "11px", color: "text.disabled" }}>
						Taux 87%
					</Typography>
				</Card>
			</Box>
			<TextField
				label="Rechercher par prénom, nom ou email"
				variant="outlined"
				fullWidth
				sx={{
					mb: 3,
					bgcolor: "white",
					borderRadius: 2,
					"& .MuiOutlinedInput-root": {
						"& fieldset": {
							borderColor: "#000000",
							borderWidth: "1px",
						},
						"&:hover fieldset": {
							borderColor: "#00FFD1",
						},
						"&.Mui-focused fieldset": {
							borderColor: "#00FFD1",
						},
					},
				}}
				value={search}
				onChange={(e) => setSearch(e.target.value)}
			/>
			<TableContainer component={Paper}>
				<Table>
					<TableHead>
						<TableRow sx={{ bgcolor: "#2f5071" }}>
							<TableCell
								sx={{
									fontWeight: "bold",
									color: "white",
								}}
							>
								Prénom
							</TableCell>
							<TableCell
								sx={{
									fontWeight: "bold",
									color: "white",
								}}
							>
								Nom
							</TableCell>
							<TableCell
								sx={{
									fontWeight: "bold",
									color: "white",
								}}
							>
								Email
							</TableCell>
							<TableCell
								sx={{
									fontWeight: "bold",
									color: "white",
								}}
							>
								Modifier
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{filteredUsers.length > 0 ? (
							filteredUsers.map((user) => (
								<User
									key={user.id}
									user={user}
									setCurrentUser={setCurrentUser}
									SetIsUpdate={SetIsUpdate}
								/>
							))
						) : (
							<TableRow>
								<TableCell colSpan={4}>No Data</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>
			{currentUser && <Profile currentUser={currentUser} />}
		</Box>
	);
}
