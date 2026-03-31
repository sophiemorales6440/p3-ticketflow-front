import {
	Box,
	Button,
	MenuItem,
	Paper,
	TextField,
	Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { fetchWithToken } from "../../utils/api";
import AttachmentsPanel from "./AttachmentsPanel";
import Comments from "./Comments";

export default function TicketEdit() {
	const navigate = useNavigate();
	const { id } = useParams();
	const { user } = useAuth();

	const redirectActionUser = () => {
		if (user?.role === "admin") {
			navigate("/tickets");
		} else {
			navigate("/client/dashboard");
		}
	};

	const handleDelete = async () => {
		await fetchWithToken(`http://localhost:3310/api/tickets/${id}`, {
			method: "DELETE",
		});
		redirectActionUser();
	};

	const [title, setTitle] = useState("");
	const [status, setStatus] = useState("");
	const [description, setDescription] = useState("");
	const [priority, setPriority] = useState("");
	const [category_id, setCategoryId] = useState("");
	const [_attachment, _setAttachment] = useState<File | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		await fetchWithToken(`http://localhost:3310/api/tickets/${id}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				title,
				description,
				priority,
				category_id,
				status,
				client_id: user?.id,
				technician_id: null, //TODO: sera assigné par l'admin plus tard
			}),
		});
		redirectActionUser();
	};

	useEffect(() => {
		fetchWithToken(`http://localhost:3310/api/tickets/${id}`)
			.then((response) => response.json())
			.then((data) => {
				setTitle(data.title);
				setDescription(data.description);
				setStatus(data.status);
				setPriority(data.priority);
				setCategoryId(data.category_id);
			})
			.catch((error) => console.error(error));
	}, [id]);

	return (
		<>
			<Box
				component="form"
				onSubmit={handleSubmit}
				sx={{ display: "flex", justifyContent: "center", p: 3 }}
			>
				<Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 480 }}>
					<Typography variant="h5" mb={3}>
						Modifier le ticket
					</Typography>
					<TextField
						label="Titre"
						fullWidth
						sx={{ mb: 2 }}
						value={title}
						onChange={(e) => setTitle(e.target.value)}
					/>
					<TextField
						label="Description"
						fullWidth
						sx={{ mb: 2 }}
						value={description}
						onChange={(e) => setDescription(e.target.value)}
					/>
					<TextField
						select
						label="Status"
						fullWidth
						sx={{ mb: 2 }}
						value={status}
						onChange={(e) => setStatus(e.target.value)}
					>
						<MenuItem value="open">Ouvert</MenuItem>
						<MenuItem value="in_progress">En cours</MenuItem>
						<MenuItem value="resolved">Résolu</MenuItem>
						<MenuItem value="closed">Fermé</MenuItem>
					</TextField>

					<TextField
						select
						label="Priorité"
						fullWidth
						sx={{ mb: 2 }}
						value={priority}
						onChange={(e) => setPriority(e.target.value)}
					>
						<MenuItem value="low">Basse</MenuItem>
						<MenuItem value="medium">Moyenne</MenuItem>
						<MenuItem value="high">Haute</MenuItem>
						<MenuItem value="critical">Critique</MenuItem>
					</TextField>

					<TextField
						select
						label="Catégorie"
						fullWidth
						sx={{ mb: 2 }}
						value={category_id}
						onChange={(e) => setCategoryId(e.target.value)}
					>
						<MenuItem value="1">Logiciel</MenuItem>
						<MenuItem value="2">Matériel</MenuItem>
						<MenuItem value="3">Réseau</MenuItem>
						<MenuItem value="4">Autre</MenuItem>
					</TextField>

					<Button type="submit" variant="contained" color="primary">
						Enregistrer
					</Button>

					<Button variant="contained" color="error" onClick={handleDelete}>
						Supprimer
					</Button>
				</Paper>
			</Box>
			<AttachmentsPanel ticketId={String(id)} />
			<Comments ticketId={Number(id)} />
		</>
	);
}
