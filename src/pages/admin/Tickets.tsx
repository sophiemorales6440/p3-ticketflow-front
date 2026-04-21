import {
	Box,
	Chip,
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
import { useNavigate } from "react-router-dom";
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
	resolved_at: string | null;
}

const STATUS_COLOR: Record<
	string,
	"default" | "primary" | "warning" | "success" | "error" | "info"
> = {
	open: "info",
	in_progress: "warning",
	waiting: "default",
	resolved: "success",
};

const PRIORITY_COLOR: Record<
	string,
	"default" | "warning" | "success" | "error"
> = {
	high: "error",
	medium: "warning",
	low: "success",
};

export default function Tickets() {
	const [ticket, setTicket] = useState<TicketType[]>([]);
	const navigate = useNavigate();

	useEffect(() => {
		fetchWithToken(`${import.meta.env.VITE_API_URL}/api/tickets/`)
			.then((response) => response.json())
			.then((data) => setTicket(data))
			.catch((error) => console.error(error));
	}, []);

	return (
		<Box sx={{ p: { xs: 2, sm: 3 } }}>
			<Typography variant="h5" fontWeight={600} gutterBottom>
				Tickets
			</Typography>
			<Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
				{ticket.length} ticket{ticket.length > 1 ? "s" : ""}
			</Typography>

			<TableContainer
				component={Paper}
				elevation={0}
				sx={{ border: "1px solid", borderColor: "divider", borderRadius: 3 }}
			>
				<Table>
					<TableHead>
						<TableRow sx={{ bgcolor: "#e8f0fe" }}>
							{[
								"ID",
								"Titre",
								"Statut",
								"Priorité",
								"Catégorie",
								"Créé le",
							].map((h) => (
								<TableCell
									key={h}
									sx={{
										fontSize: "0.7rem",
										fontWeight: 600,
										textTransform: "uppercase",
										letterSpacing: "0.07em",
										color: "text.secondary",
									}}
								>
									{h}
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{ticket.map((t) => (
							<TableRow
								key={t.id}
								onClick={() => navigate(`/tickets/${t.id}/edit`)}
								sx={{
									cursor: "pointer",
									"&:last-child td": { border: 0 },
									"&:hover": { bgcolor: "action.hover" },
								}}
							>
								<TableCell
									sx={{
										color: "text.disabled",
										fontSize: "0.75rem",
										fontFamily: "monospace",
									}}
								>
									#{t.id}
								</TableCell>
								<TableCell>
									<Typography
										variant="body2"
										fontWeight={500}
										noWrap
										sx={{ maxWidth: 220 }}
									>
										{t.title}
									</Typography>
								</TableCell>
								<TableCell>
									<Chip
										label={translateStatus(t.status)}
										color={STATUS_COLOR[t.status] ?? "default"}
										size="small"
										sx={{ borderRadius: "99px", fontSize: "0.7rem" }}
									/>
								</TableCell>
								<TableCell>
									<Chip
										label={translatePriority(t.priority)}
										color={PRIORITY_COLOR[t.priority] ?? "default"}
										size="small"
										sx={{ borderRadius: "99px", fontSize: "0.7rem" }}
									/>
								</TableCell>
								<TableCell>
									<Chip
										label={t.category_name}
										size="small"
										variant="outlined"
										sx={{ borderRadius: 1.5, fontSize: "0.7rem" }}
									/>
								</TableCell>
								<TableCell
									sx={{
										color: "text.secondary",
										fontSize: "0.8rem",
										whiteSpace: "nowrap",
									}}
								>
									{formatDate(t.created_at)}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</Box>
	);
}
