import {
	Box,
	Paper,
	Tab,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Tabs,
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
	role: string;
	email: string;
	password: string;
}

export default function Users() {
	const [users, setUsers] = useState<UserType[]>([]);
	const [currentUser, setCurrentUser] = useState<UserType | null>(null);
	const [isUpdate, SetIsUpdate] = useState(false);
	const [search, setSearch] = useState("");
	const [activeTab, setActiveTab] = useState(0);

	useEffect(() => {
		fetchWithToken("http://localhost:3310/api/users/")
			.then((response) => response.json())
			.then((data) => setUsers(data))
			.catch((error) => console.error(error));
	}, [isUpdate]);

	const filteredUsers = users.filter(
		(user) =>
			user.firstname.toLowerCase().includes(search.toLowerCase()) ||
			user.lastname.toLowerCase().includes(search.toLowerCase()) ||
			user.email.toLowerCase().includes(search.toLowerCase()),
	);

	const staffUsers = filteredUsers.filter((user) => user.role !== "client");
	const clientsUsers = filteredUsers.filter((user) => user.role === "client");

	return (
		<Box sx={{ p: 3 }}>
			<Typography variant="h4" gutterBottom>
				Gestion des utilisateurs
			</Typography>

			<TextField
				label="Rechercher par prénom, nom ou email"
				variant="outlined"
				fullWidth
				sx={{
					mb: 3,
					bgcolor: "white",
					borderRadius: 2,
					"& .MuiOutlinedInput-root": {
						"& fieldset": { borderColor: "#000000", borderWidth: "1px" },
						"&:hover fieldset": { borderColor: "#00FFD1" },
						"&.Mui-focused fieldset": { borderColor: "#00FFD1" },
					},
				}}
				value={search}
				onChange={(e) => setSearch(e.target.value)}
			/>
			<TableContainer component={Paper}>
				<Tabs
					value={activeTab}
					onChange={(_, newValue) => setActiveTab(newValue)}
				>
					<Tab label="Staff" />
					<Tab label="Nos Clients" />
				</Tabs>
				<Table>
					<TableHead>
						<TableRow sx={{ bgcolor: "#2f5071" }}>
							<TableCell sx={{ fontWeight: "bold", color: "white" }}>
								Prénom
							</TableCell>
							<TableCell sx={{ fontWeight: "bold", color: "white" }}>
								Nom
							</TableCell>
							<TableCell sx={{ fontWeight: "bold", color: "white" }}>
								Email
							</TableCell>
							<TableCell sx={{ fontWeight: "bold", color: "white" }}>
								Role
							</TableCell>
							<TableCell sx={{ fontWeight: "bold", color: "white" }}>
								Modifier
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{(activeTab === 0 ? staffUsers : clientsUsers).map((user) => (
							<User
								key={user.id}
								user={user}
								setCurrentUser={setCurrentUser}
								SetIsUpdate={SetIsUpdate}
							/>
						))}
					</TableBody>
				</Table>
			</TableContainer>
			{currentUser && <Profile currentUser={currentUser} />}
		</Box>
	);
}
