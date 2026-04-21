import {
	Box,
	Button,
	Divider,
	MenuItem,
	Paper,
	Stack,
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

	const isClient = user?.role === "client";
	const [title, setTitle] = useState("");
	const [status, setStatus] = useState("");
	const [description, setDescription] = useState("");
	const [priority, setPriority] = useState("");
	const [category_id, setCategoryId] = useState("");
	// Conserver les valeurs originales du ticket
	const [originalClientId, setOriginalClientId] = useState<number | null>(null);
	const [originalTechnicianId, setOriginalTechnicianId] = useState<
		number | null
	>(null);

	const redirectActionUser = () => {
		if (user?.role === "admin") {
			navigate("/tickets");
		} else {
			navigate("/client/dashboard");
		}
	};

	const handleDelete = async () => {
		if (!window.confirm("Supprimer ce ticket définitivement ?")) return;
		await fetchWithToken(`${import.meta.env.VITE_API_URL}/api/tickets/${id}`, {
			method: "DELETE",
		});
		redirectActionUser();
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		await fetchWithToken(`${import.meta.env.VITE_API_URL}/api/tickets/${id}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				title,
				description,
				priority,
				category_id,
				status,
				// Conserver le client et technicien d'origine, ne pas les écraser
				client_id: originalClientId,
				technician_id: originalTechnicianId,
			}),
		});
		redirectActionUser();
	};

	useEffect(() => {
		fetchWithToken(`${import.meta.env.VITE_API_URL}/api/tickets/${id}`)
			.then((res) => res.json())
			.then((data) => {
				setTitle(data.title);
				setDescription(data.description);
				setStatus(data.status);
				setPriority(data.priority);
				setCategoryId(data.category_id);
				// Sauvegarder les valeurs originales
				setOriginalClientId(data.client_id);
				setOriginalTechnicianId(data.technician_id);
			})
			.catch((err) => console.error(err));
	}, [id]);

	return (
		<Box sx={{ maxWidth: 1100, mx: "auto", px: 3, py: 4 }}>
			<Typography variant="overline" color="text.secondary">
				Ticket #{id}
			</Typography>
			<Typography variant="h5" fontWeight={600} mb={3}>
				Modifier le ticket
			</Typography>

			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
					gap: 3,
					alignItems: "start",
				}}
			>
				<Paper
					elevation={0}
					variant="outlined"
					sx={{ p: 3, borderRadius: 2 }}
					component="form"
					onSubmit={handleSubmit}
				>
					<Typography variant="subtitle1" fontWeight={600} mb={2}>
						Informations
					</Typography>

					<Stack spacing={2}>
						<TextField
							label="Titre"
							fullWidth
							value={title}
							onChange={(e) => setTitle(e.target.value)}
						/>
						<TextField
							label="Description"
							fullWidth
							multiline
							minRows={3}
							value={description}
							onChange={(e) => setDescription(e.target.value)}
						/>
						{!isClient && (
							<>
								<TextField
									select
									label="Statut"
									fullWidth
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
									value={priority}
									onChange={(e) => setPriority(e.target.value)}
								>
									<MenuItem value="low">Basse</MenuItem>
									<MenuItem value="medium">Moyenne</MenuItem>
									<MenuItem value="high">Haute</MenuItem>
									<MenuItem value="critical">Critique</MenuItem>
								</TextField>
							</>
						)}
						<TextField
							select
							label="Catégorie"
							fullWidth
							value={category_id}
							onChange={(e) => setCategoryId(e.target.value)}
						>
							<MenuItem value="1">Logiciel</MenuItem>
							<MenuItem value="2">Matériel</MenuItem>
							<MenuItem value="3">Réseau</MenuItem>
							<MenuItem value="4">Autre</MenuItem>
						</TextField>
					</Stack>

					<Divider sx={{ my: 3 }} />
					<Box
						sx={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
						}}
					>
						<Button type="submit" variant="contained" color="primary">
							Enregistrer
						</Button>
						<Button
							variant="text"
							color="error"
							size="small"
							onClick={handleDelete}
						>
							Supprimer le ticket
						</Button>
					</Box>
				</Paper>

				<Stack spacing={3}>
					<AttachmentsPanel ticketId={String(id)} />
					<Comments ticketId={Number(id)} />
				</Stack>
			</Box>
		</Box>
	);
}
