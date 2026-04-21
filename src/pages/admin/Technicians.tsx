import {
	Box,
	Chip,
	IconButton,
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
import { Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchWithToken } from "../../utils/api";

interface UserType {
	id: number;
	firstname: string;
	lastname: string;
	role: string;
	email: string;
	password: string;
}

interface TicketType {
	id: number;
	title: string;
	status: string;
	priority: string;
	category_id: number;
	category_name: string;
	created_at: string;
	resolved_at: string | null;
}

export default function Technicians() {
	const [technicians, setTechnicians] = useState<UserType[]>([]);
	const [search, setSearch] = useState("");
	const [selectedTechnician, setSelectedTechnician] = useState<UserType | null>(
		null,
	);
	const [tickets, setTickets] = useState<TicketType[]>([]);

	useEffect(() => {
		fetchWithToken(`${import.meta.env.VITE_API_URL}/api/users/`)
			.then((response) => response.json())
			.then((data) =>
				setTechnicians(
					data.filter((user: { role: string }) => user.role === "technician"),
				),
			)
			.catch((error) => console.error(error));
	}, []);

	useEffect(() => {
		if (!selectedTechnician) return;
		fetchWithToken(
			`${import.meta.env.VITE_API_URL}/api/users/${selectedTechnician.id}/tickets`,
		)
			.then((response) => response.json())
			.then((data) => setTickets(data))
			.catch((error) => console.error(error));
	}, [selectedTechnician]);

	const filteredTechnicians = technicians.filter(
		(user) =>
			user.firstname.toLowerCase().includes(search.toLowerCase()) ||
			user.lastname.toLowerCase().includes(search.toLowerCase()) ||
			user.email.toLowerCase().includes(search.toLowerCase()),
	);

	const STATUS_LABELS: Record<string, string> = {
		open: "En attente",
		in_progress: "En cours",
		resolved: "Résolu",
		closed: "Fermé",
	};

	const PRIORITY_LABELS: Record<string, string> = {
		low: "Basse",
		medium: "Moyenne",
		high: "Haute",
		critical: "Critique",
	};

	const statusColor = (
		status: string,
	):
		| "default"
		| "primary"
		| "secondary"
		| "error"
		| "info"
		| "success"
		| "warning" => {
		switch (status) {
			case "open":
				return "warning";
			case "in_progress":
				return "info";
			case "resolved":
				return "success";
			case "closed":
				return "default";
			default:
				return "default";
		}
	};

	const priorityColor = (
		priority: string,
	):
		| "default"
		| "primary"
		| "secondary"
		| "error"
		| "info"
		| "success"
		| "warning" => {
		switch (priority) {
			case "low":
				return "default";
			case "medium":
				return "info";
			case "high":
				return "warning";
			case "critical":
				return "error";
			default:
				return "default";
		}
	};

	return (
		<Box sx={{ p: 3 }}>
			<Typography variant="h4" gutterBottom>
				Gestion de mes Techniciens
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
			<Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
				{filteredTechnicians.length} technicien
				{filteredTechnicians.length > 1 ? "s" : ""}
			</Typography>
			<TableContainer component={Paper}>
				<Table>
					<TableHead>
						<TableRow sx={{ bgcolor: "#e8f0fe" }}>
							<TableCell sx={{ fontWeight: "bold", color: "text.secondary" }}>
								Prénom
							</TableCell>
							<TableCell sx={{ fontWeight: "bold", color: "text.secondary" }}>
								Nom
							</TableCell>
							<TableCell sx={{ fontWeight: "bold", color: "text.secondary" }}>
								Email
							</TableCell>
							<TableCell sx={{ fontWeight: "bold", color: "text.secondary" }}>
								Role
							</TableCell>
							<TableCell sx={{ fontWeight: "bold", color: "text.secondary" }}>
								Tickets assignés
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{filteredTechnicians.map((technicien) => (
							<TableRow key={technicien.id} hover>
								<TableCell>{technicien.firstname}</TableCell>
								<TableCell>{technicien.lastname}</TableCell>
								<TableCell>{technicien.email}</TableCell>
								<TableCell>Technicien</TableCell>
								<TableCell>
									<IconButton onClick={() => setSelectedTechnician(technicien)}>
										<Eye size={18} />
									</IconButton>
								</TableCell>
							</TableRow>
						))}
						{filteredTechnicians.length === 0 && (
							<TableRow>
								<TableCell colSpan={5} align="center" sx={{ py: 4 }}>
									<Typography variant="body2" color="text.secondary">
										Aucun technicien trouvé
									</Typography>
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>
			{selectedTechnician && (
				<Box
					sx={{
						mt: 3,
						p: 2.5,
						bgcolor: "background.paper",
						border: "0.5px solid",
						borderColor: "divider",
						borderRadius: 3,
					}}
				>
					<Typography
						variant="h6"
						sx={{ mb: 2, fontWeight: 500, color: "text.primary" }}
					>
						Tickets de {selectedTechnician.firstname}{" "}
						{selectedTechnician.lastname}
					</Typography>

					{tickets.map((ticket) => (
						<Box
							key={ticket.id}
							sx={{
								p: 1.5,
								mb: 1.25,
								bgcolor: "background.default",
								border: "0.5px solid",
								borderColor: "divider",
								borderRadius: 2,
								"&:hover": { borderColor: "text.disabled" },
								"&:last-child": { mb: 0 },
							}}
						>
							<Typography
								variant="body2"
								sx={{ fontWeight: 500, mb: 0.75, color: "text.primary" }}
							>
								{ticket.title}
							</Typography>

							<Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
								<Chip
									label={STATUS_LABELS[ticket.status] ?? ticket.status}
									size="small"
									color={statusColor(ticket.status)}
								/>
								<Chip
									label={PRIORITY_LABELS[ticket.priority] ?? ticket.priority}
									size="small"
									color={priorityColor(ticket.priority)}
								/>
								<Chip
									label={ticket.category_name}
									size="small"
									variant="outlined"
								/>
							</Box>
						</Box>
					))}
				</Box>
			)}
		</Box>
	);
}
