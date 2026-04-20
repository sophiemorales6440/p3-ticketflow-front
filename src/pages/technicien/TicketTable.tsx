import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
	Box,
	Chip,
	Divider,
	FormControl,
	IconButton,
	InputAdornment,
	InputLabel,
	MenuItem,
	Paper,
	Select,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField,
	Typography,
} from "@mui/material";
import { useState } from "react";
import {
	PRIORITY_COLORS,
	PRIORITY_LABELS,
	STATUS_COLORS,
	STATUS_LABELS,
	type TicketType,
	timeAgo,
} from "./TechnicienDashboard.utils";

interface Props {
	tickets: TicketType[];
	selectedTicketId: number | null;
	onSelectTicket: (ticket: TicketType) => void;
}

export default function TicketTable({
	tickets,
	selectedTicketId,
	onSelectTicket,
}: Props) {
	const [tabStatus, setTabStatus] = useState("all");
	const [filterPriority, setFilterPriority] = useState("all");
	const [sortBy, setSortBy] = useState("date");
	const [search, setSearch] = useState("");

	const filtered = tickets
		.filter((t) => {
			if (tabStatus !== "all" && t.status !== tabStatus) return false;
			if (filterPriority !== "all" && t.priority !== filterPriority)
				return false;
			if (search && !t.title.toLowerCase().includes(search.toLowerCase()))
				return false;
			return true;
		})
		.sort((a, b) => {
			if (sortBy === "date")
				return (
					new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
				);
			if (sortBy === "priority") {
				const order = { critical: 0, high: 1, medium: 2, low: 3 };
				return (
					(order[a.priority as keyof typeof order] ?? 4) -
					(order[b.priority as keyof typeof order] ?? 4)
				);
			}
			if (sortBy === "title") return a.title.localeCompare(b.title);
			if (sortBy === "id") return b.id - a.id;
			return 0;
		});

	return (
		<Paper
			elevation={0}
			sx={{ borderRadius: 2, border: "1px solid", borderColor: "divider" }}
		>
			<Box sx={{ px: 2, pt: 2 }}>
				<Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
					<TextField
						size="small"
						placeholder="Rechercher un ticket..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						sx={{ flex: 1, minWidth: 180 }}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<SearchIcon fontSize="small" />
								</InputAdornment>
							),
						}}
					/>
					<FormControl size="small" sx={{ minWidth: 140 }}>
						<InputLabel>État</InputLabel>
						<Select
							value={tabStatus}
							label="État"
							onChange={(e) => setTabStatus(e.target.value)}
						>
							<MenuItem value="all">Tous</MenuItem>
							<MenuItem value="in_progress">En cours</MenuItem>
							<MenuItem value="open">En attente</MenuItem>
							<MenuItem value="resolved">Résolus</MenuItem>
						</Select>
					</FormControl>
					<FormControl size="small" sx={{ minWidth: 140 }}>
						<InputLabel>Priorité</InputLabel>
						<Select
							value={filterPriority}
							label="Priorité"
							onChange={(e) => setFilterPriority(e.target.value)}
						>
							<MenuItem value="all">Toutes</MenuItem>
							<MenuItem value="critical">Critique</MenuItem>
							<MenuItem value="high">Élevée</MenuItem>
							<MenuItem value="medium">Moyenne</MenuItem>
							<MenuItem value="low">Basse</MenuItem>
						</Select>
					</FormControl>
					<FormControl size="small" sx={{ minWidth: 140 }}>
						<InputLabel>Trier par</InputLabel>
						<Select
							value={sortBy}
							label="Trier par"
							onChange={(e) => setSortBy(e.target.value)}
						>
							<MenuItem value="date">Date</MenuItem>
							<MenuItem value="priority">Priorité</MenuItem>
							<MenuItem value="title">Titre</MenuItem>
							<MenuItem value="id">ID</MenuItem>
						</Select>
					</FormControl>
				</Box>
			</Box>

			<Divider />

			<TableContainer sx={{ maxHeight: 400, overflow: "auto" }}>
				<Table size="small">
					<TableHead>
						<TableRow sx={{ bgcolor: "#e8f0fe" }}>
							{[
								"N°",
								"Sujet",
								"Catégorie",
								"Priorité",
								"Statut",
								"Temps écoulé",
								"Action",
							].map((h) => (
								<TableCell
									key={h}
									sx={{
										fontWeight: 600,
										fontSize: 12,
										color: "text.secondary",
									}}
								>
									{h}
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{filtered.map((ticket) => (
							<TableRow
								key={ticket.id}
								hover
								selected={selectedTicketId === ticket.id}
								sx={{
									bgcolor:
										ticket.technician_id == null || ticket.technician_id === 0
											? "rgba(239, 68, 68, 0.20)"
											: ticket.status === "in_progress"
												? "rgba(59, 130, 246, 0.20)"
												: ticket.status === "open"
													? "rgba(234, 179, 8, 0.20)"
													: ticket.status === "resolved"
														? "rgba(34, 197, 94, 0.20)"
														: "inherit",
								}}
							>
								<TableCell
									sx={{
										fontSize: 14,
										fontWeight: 600,
										color: "primary.main",
									}}
								>
									#{ticket.id}
								</TableCell>
								<TableCell sx={{ fontSize: 14 }}>{ticket.title}</TableCell>
								<TableCell sx={{ fontSize: 14 }}>
									{ticket.category_name}
								</TableCell>
								<TableCell>
									<Box
										sx={{
											display: "flex",
											alignItems: "center",
											gap: 0.8,
										}}
									>
										<Box
											sx={{
												width: 10,
												height: 10,
												borderRadius: "50%",
												bgcolor: PRIORITY_COLORS[ticket.priority] ?? "#888",
												flexShrink: 0,
											}}
										/>
										<Typography sx={{ fontSize: 12 }}>
											{PRIORITY_LABELS[ticket.priority]}
										</Typography>
									</Box>
								</TableCell>
								<TableCell>
									<Chip
										label={STATUS_LABELS[ticket.status]}
										color={STATUS_COLORS[ticket.status]}
										size="small"
										sx={{ fontSize: 11 }}
									/>
								</TableCell>
								<TableCell sx={{ fontSize: 12, color: "text.secondary" }}>
									{timeAgo(ticket.created_at)}
								</TableCell>
								<TableCell>
									{(!ticket.technician_id || ticket.technician_id === 0) && (
										<Chip
											label="Non assigné"
											color="error"
											size="small"
											sx={{ mr: 1 }}
										/>
									)}
									<IconButton
										size="small"
										onClick={() => onSelectTicket(ticket)}
										color={
											selectedTicketId === ticket.id ? "primary" : "default"
										}
									>
										<VisibilityIcon fontSize="small" />
									</IconButton>
								</TableCell>
							</TableRow>
						))}
						{filtered.length === 0 && (
							<TableRow>
								<TableCell
									colSpan={7}
									align="center"
									sx={{ py: 4, color: "text.secondary" }}
								>
									Aucun ticket trouvé
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>
		</Paper>
	);
}
