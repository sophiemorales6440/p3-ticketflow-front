import CloseIcon from "@mui/icons-material/Close";
import {
	Box,
	Chip,
	IconButton,
	MenuItem,
	Paper,
	TextField,
	Typography,
} from "@mui/material";
import { fetchWithToken } from "../../utils/api";
import Comments from "../admin/Comments";
import {
	PRIORITY_COLORS,
	PRIORITY_LABELS,
	STATUS_COLORS,
	STATUS_LABELS,
	type TicketType,
} from "./TechnicienDashboard.utils";

interface Props {
	ticket: TicketType;
	onClose: () => void;
	onStatusChange: (ticketId: number, newStatus: string) => void;
}

export default function TicketDetailPanel({
	ticket,
	onClose,
	onStatusChange,
}: Props) {
	const handleStatusChange = async (newStatus: string) => {
		await fetchWithToken(`http://localhost:3310/api/tickets/${ticket.id}`, {
			method: "PUT",
			body: JSON.stringify({
				title: ticket.title,
				description: ticket.description,
				status: newStatus,
				priority: ticket.priority,
				client_id: ticket.client_id,
				technician_id: ticket.technician_id,
				category_id: ticket.category_id,
			}),
		});
		onStatusChange(ticket.id, newStatus);
	};

	return (
		<Paper
			elevation={0}
			sx={{
				width: 360,
				flexShrink: 0,
				border: "1px solid",
				borderColor: "divider",
				borderRadius: 2,
				overflow: "hidden",
			}}
		>
			{/* Header */}
			<Box
				sx={{
					px: 2,
					py: 1.5,
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					borderBottom: "1px solid",
					borderColor: "divider",
					bgcolor: "grey.50",
				}}
			>
				<Typography variant="subtitle2" fontWeight={600}>
					Ticket #{ticket.id}
				</Typography>
				<IconButton size="small" onClick={onClose}>
					<CloseIcon fontSize="small" />
				</IconButton>
			</Box>

			{/* Infos ticket */}
			<Box
				sx={{
					px: 2,
					py: 2,
					borderBottom: "1px solid",
					borderColor: "divider",
				}}
			>
				<Typography variant="caption" color="text.secondary">
					Sujet
				</Typography>
				<Typography variant="body2" fontWeight={500} mb={2}>
					{ticket.title}
				</Typography>

				<Typography variant="caption" color="text.secondary">
					Description
				</Typography>
				<Typography variant="body2" mb={2}>
					{ticket.description}
				</Typography>

				<Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
					<Chip
						label={PRIORITY_LABELS[ticket.priority]}
						size="small"
						sx={{
							bgcolor: `${PRIORITY_COLORS[ticket.priority]}22`,
							color: PRIORITY_COLORS[ticket.priority],
							fontWeight: 600,
						}}
					/>
					<Chip label={ticket.category_name} size="small" variant="outlined" />
				</Box>

				{/* Changement de statut */}
				<TextField
					select
					label="Statut"
					size="small"
					fullWidth
					value={ticket.status}
					onChange={(e) => handleStatusChange(e.target.value)}
				>
					{Object.entries(STATUS_LABELS).map(([value, label]) => (
						<MenuItem key={value} value={value}>
							<Chip
								label={label}
								color={STATUS_COLORS[value]}
								size="small"
								sx={{ fontSize: 11 }}
							/>
						</MenuItem>
					))}
				</TextField>
			</Box>

			{/* Commentaires */}
			<Box sx={{ p: 2 }}>
				<Comments ticketId={ticket.id} />
			</Box>
		</Paper>
	);
}
