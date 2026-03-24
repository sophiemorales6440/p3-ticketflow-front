import {
	Box,
	Button,
	MenuItem,
	Paper,
	TextField,
	Typography,
} from "@mui/material";
import { useState } from "react";

export default function TicketForm() {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [priority, setPriority] = useState("");
	const [category_id, setCategoryId] = useState("");
	const [_attachment, setAttachment] = useState<File | null>(null); //  TODO à brancher avec la route attachments du back, puis enlever le _ pour éviter les warnings de variable non utilisée

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		//TODO:  ajouter l'attachment dansFormData quand la  route du back sera prête
		await fetch("http://localhost:3310/api/tickets", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				title,
				description,
				priority,
				category_id,
				status: "open", // TODO: sera géré par le back par défaut
				client_id: 3, // TODO: remplacer par currentUser.is depuis AuthContext
				technician_id: null, //TODO: sera assigné par l'admin plus tard
			}),
		});
	};

	return (
		<Box
			component="form"
			onSubmit={handleSubmit}
			sx={{ display: "flex", justifyContent: "center", p: 3 }}
		>
			<Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 480 }}>
				<Typography variant="h5" mb={3}>
					Créer un ticket
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
					multiline
					rows={4}
					sx={{ mb: 2 }}
					value={description}
					onChange={(e) => setDescription(e.target.value)}
				/>

				<TextField
					type="file"
					fullWidth
					sx={{ mb: 2 }}
					onChange={(e) => {
						const input = e.target as HTMLInputElement;
						setAttachment(input.files?.[0] ?? null);
					}}
				/>

				<TextField
					label="Priorité"
					fullWidth
					select
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
					label="Catégorie"
					fullWidth
					select
					sx={{ mb: 2 }}
					value={category_id}
					onChange={(e) => setCategoryId(e.target.value)}
				>
					<MenuItem value="1">Logiciel</MenuItem>
					<MenuItem value="2">Matériel</MenuItem>
					<MenuItem value="3">Réseau</MenuItem>
					<MenuItem value="4">Autre</MenuItem>
				</TextField>

				<Button
					type="submit"
					variant="contained"
					fullWidth
					size="large"
					sx={{ mt: 2 }}
				>
					Créer le ticket
				</Button>
			</Paper>
		</Box>
	);
}
