import AddIcon from "@mui/icons-material/Add";
import LogoutIcon from "@mui/icons-material/Logout";
import {
	Box,
	Button,
	Chip,
	Container,
	Paper,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { fetchWithToken } from "../../utils/api";
import {
	formatDate,
	translatePriority,
	translateStatus,
} from "../../utils/translations";

interface TicketType {
	id: number;
	title: string;
	status: string;
	priority: string;
	category_id: number;
	category_name: string;
	created_at: string;
	client_id: number;
	resolved_at: string | null;
}

// Couleur du badge selon le statut
function getStatusColor(
	status: string,
): "default" | "warning" | "success" | "error" | "info" {
	switch (status) {
		case "open":
			return "info";
		case "pending":
			return "warning";
		case "resolved":
			return "success";
		default:
			return "default";
	}
}

// Couleur du badge selon la priorité
function getPriorityColor(
	priority: string,
): "default" | "warning" | "error" | "success" {
	switch (priority) {
		case "high":
			return "error";
		case "medium":
			return "warning";
		case "low":
			return "success";
		default:
			return "default";
	}
}

export default function ClientDashboard() {
	const [tickets, setTicket] = useState<TicketType[]>([]);
	const navigate = useNavigate();
	const { user, handleLogout } = useAuth();

	useEffect(() => {
		console.log(user);
		console.log("userid:", user?.id);
		fetchWithToken("http://localhost:3310/api/tickets/")
			.then((response) => response.json())
			.then((data) => {
				console.log(data);
				setTicket(
					data.filter((ticket: TicketType) => ticket.client_id === user?.id),
				);
			})

			.catch((error) => console.error(error));
	}, [user]);

	const resolvedCount = tickets.filter((t) => t.status === "resolved").length;
	const openCount = tickets.filter((t) => t.status !== "resolved").length;

	return (
		<Container maxWidth="lg" sx={{ py: 4 }}>
			{/* ── Header ── */}
			<Stack
				direction="row"
				justifyContent="space-between"
				alignItems="center"
				sx={{ mb: 4, pb: 2, borderBottom: 1, borderColor: "divider" }}
			>
				<Box>
					<Typography variant="h5" fontWeight={600}>
						Bonjour, Victor
					</Typography>
					<Typography variant="body2" color="white">
						Voici un aperçu de vos tickets de support
					</Typography>
				</Box>

				<Stack direction="row" spacing={1}>
					<Button
						variant="contained"
						startIcon={<AddIcon />}
						onClick={() => navigate("/tickets/new")}
						sx={{ textTransform: "none" }}
					>
						Nouveau ticket
					</Button>
					<Button
						variant="contained"
						color="error"
						startIcon={<LogoutIcon />}
						onClick={() => {
							handleLogout();
							navigate("/login");
						}}
						sx={{ textTransform: "none" }}
					>
						Déconnexion
					</Button>
				</Stack>
			</Stack>

			{/* ── Stats ── */}
			<Stack direction="row" spacing={2} sx={{ mb: 4 }}>
				{[
					{ label: "Total tickets", value: tickets.length },
					{ label: "En cours", value: openCount },
					{ label: "Résolus", value: resolvedCount },
				].map((stat) => (
					<Paper key={stat.label} variant="outlined" sx={{ p: 2, flex: 1 }}>
						<Typography variant="body2" color="text.secondary">
							{stat.label}
						</Typography>
						<Typography variant="h4" fontWeight={600}>
							{stat.value}
						</Typography>
					</Paper>
				))}
			</Stack>

			{/* ── Tableau ── */}
			<Typography variant="h6" fontWeight={600} sx={{ mb: 1.5 }}>
				Mes tickets
			</Typography>

			<TableContainer component={Paper} variant="outlined">
				<Table>
					<TableHead>
						<TableRow sx={{ bgcolor: "action.hover" }}>
							<TableCell>#</TableCell>
							<TableCell>Titre</TableCell>
							<TableCell>Statut</TableCell>
							<TableCell>Priorité</TableCell>
							<TableCell>Catégorie</TableCell>
							<TableCell>Créé le</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{tickets.map((ticket) => (
							<TableRow
								key={ticket.id}
								onClick={() => navigate(`/tickets/${ticket.id}/edit`)}
								sx={{
									cursor: "pointer",
									"&:hover": { bgcolor: "action.hover" },
								}}
							>
								<TableCell>{ticket.id}</TableCell>
								<TableCell>{ticket.title}</TableCell>
								<TableCell>
									<Chip
										label={translateStatus(ticket.status)}
										color={getStatusColor(ticket.status)}
										size="small"
									/>
								</TableCell>
								<TableCell>
									<Chip
										label={translatePriority(ticket.priority)}
										color={getPriorityColor(ticket.priority)}
										size="small"
										variant="outlined"
									/>
								</TableCell>
								<TableCell>{ticket.category_name}</TableCell>
								<TableCell>{formatDate(ticket.created_at)}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</Container>
	);
}
