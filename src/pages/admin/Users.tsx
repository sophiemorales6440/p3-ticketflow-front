import {
	Box,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
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

	useEffect(() => {
		fetchWithToken("http://localhost:3310/api/users/")
			.then((response) => response.json())
			.then((data) => setUsers(data))
			.catch((error) => console.error(error));
	}, [isUpdate]);

	return (
		<Box sx={{ p: 3 }}>
			<Typography variant="h4" gutterBottom>
				Gestion des utilisateurs
			</Typography>
			<TableContainer component={Paper}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell
								sx={{
									fontWeight: "bold",
									bgcolor: "primary.main",
									color: "white",
								}}
							>
								Prénom
							</TableCell>
							<TableCell
								sx={{
									fontWeight: "bold",
									bgcolor: "primary.main",
									color: "white",
								}}
							>
								Nom
							</TableCell>
							<TableCell
								sx={{
									fontWeight: "bold",
									bgcolor: "primary.main",
									color: "white",
								}}
							>
								Email
							</TableCell>
							<TableCell
								sx={{
									fontWeight: "bold",
									bgcolor: "primary.main",
									color: "white",
								}}
							>
								Modifier
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{users.length > 0 ? (
							users.map((user) => (
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
