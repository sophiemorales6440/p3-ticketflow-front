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
	});

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

	const statusColor = (status: string) => {
		if (status === "open") return "info";
		if (status === "closed") return "success";
		if (status === "pending") return "warning";
		return "default";
	};

	const priorityColor = (priority: string) => {
		if (priority === "high") return "error";
		if (priority === "medium") return "warning";
		if (priority === "low") return "success";
		return "default";
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
			<TableContainer component={Paper}>
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
						{filteredTechnicians.map((technician) => (
							<TableRow key={technician.id}>
								<TableCell>{technician.firstname}</TableCell>
								<TableCell>{technician.lastname}</TableCell>
								<TableCell>{technician.email}</TableCell>
								<TableCell>{technician.role}</TableCell>
								<TableCell>
									<IconButton onClick={() => setSelectedTechnician(technician)}>
										<Eye size={18} />
									</IconButton>
								</TableCell>
							</TableRow>
						))}
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
									label={ticket.status}
									size="small"
									color={statusColor(ticket.status)}
								/>
								<Chip
									label={ticket.priority}
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
