import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	IconButton,
	MenuItem,
	TableCell,
	TableRow,
	TextField,
} from "@mui/material";
import { Check, PencilLine, Trash2, UserCheck } from "lucide-react";
import { useState } from "react";
import { fetchWithToken } from "../../utils/api";

interface UserType {
	id: number;
	firstname: string;
	lastname: string;
	email: string;
	password: string;
	role: string;
}

interface Props {
	user: UserType;
	setCurrentUser: React.Dispatch<React.SetStateAction<UserType | null>>;
	SetIsUpdate: React.Dispatch<React.SetStateAction<boolean>>;
}

const User = ({ user, setCurrentUser, SetIsUpdate }: Props) => {
	const [isEdit, setIsEdit] = useState(false);
	const [firstname, setFirstname] = useState("");
	const [lastname, setLastname] = useState("");
	const [email, setEmail] = useState("");
	const [role, setRole] = useState("");
	const [openConfirm, setOpenConfirm] = useState(false);

	const handleEdit = () => {
		console.log(user);
		setIsEdit(true);
	};

	const handleDelete = async () => {
		const response = await fetch(
			`${import.meta.env.VITE_API_URL}/api/users/${user.id}`,
			{
				method: "DELETE",
				headers: {
					"content-Type": "application/json",
				},
			},
		);

		if (response.ok) {
			SetIsUpdate((prev) => !prev);
		}
	};

	const handleSave = async () => {
		const newData = {
			id: user.id,
			firstname: firstname || user.firstname,
			lastname: lastname || user.lastname,
			email: email || user.email,
			role: role || user.role,
		};

		const response = await fetchWithToken(
			`${import.meta.env.VITE_API_URL}/api/users/${user.id}`,
			{
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(newData),
			},
		);

		if (response.ok) {
			SetIsUpdate((prev) => !prev);
			setIsEdit(false);
			setFirstname("");
			setLastname("");
			setEmail("");
		}
	};
	const ROLE_LABELS: Record<string, string> = {
		admin: "Administrateur",
		technician: "Technicien",
		client: "Client",
	};

	return (
		<TableRow hover sx={{ "&:hover": { bgcolor: "action.hover" } }}>
			<TableCell>
				{isEdit ? (
					<TextField
						size="small"
						variant="outlined"
						type="text"
						name="firstname"
						value={firstname ? firstname : user.firstname}
						onChange={(event) => setFirstname(event.target.value)}
					/>
				) : (
					user.firstname
				)}
			</TableCell>

			<TableCell>
				{isEdit ? (
					<TextField
						size="small"
						variant="outlined"
						type="text"
						name="lastname"
						value={lastname ? lastname : user.lastname}
						onChange={(event) => setLastname(event.target.value)}
					/>
				) : (
					user.lastname
				)}
			</TableCell>

			<TableCell>
				{isEdit ? (
					<TextField
						size="small"
						variant="outlined"
						type="email"
						name="email"
						value={email ? email : user.email}
						onChange={(event) => setEmail(event.target.value)}
					/>
				) : (
					user.email
				)}
			</TableCell>

			<TableCell>
				{isEdit ? (
					user.role === "client" ? (
						(ROLE_LABELS[user.role] ?? user.role)
					) : (
						<TextField
							select
							size="small"
							variant="outlined"
							type="role"
							name="role"
							value={role ? role : user.role}
							onChange={(event) => setRole(event.target.value)}
						>
							<MenuItem value="admin">Admin</MenuItem>
							<MenuItem value="technician">Technicien</MenuItem>
						</TextField>
					)
				) : (
					(ROLE_LABELS[user.role] ?? user.role)
				)}
			</TableCell>

			<TableCell sx={{ display: "flex", gap: 0.5 }}>
				{isEdit ? (
					<IconButton color="success" onClick={handleSave}>
						<Check size={18} />
					</IconButton>
				) : (
					<IconButton color="primary" onClick={handleEdit}>
						<PencilLine size={18} />
					</IconButton>
				)}
				<IconButton color="info" onClick={() => setCurrentUser(user)}>
					<UserCheck size={18} />
				</IconButton>
				<IconButton color="error" onClick={() => setOpenConfirm(true)}>
					<Trash2 size={18} />
				</IconButton>
			</TableCell>
			<Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
				<DialogTitle>Confirmer la suppression</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action
						est irréversible.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setOpenConfirm(false)} color="primary">
						Annuler
					</Button>
					<Button onClick={handleDelete} color="error">
						Supprimer
					</Button>
				</DialogActions>
			</Dialog>
		</TableRow>
	);
};

export default User;
