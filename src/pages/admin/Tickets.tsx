import {
	Box,
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
	translateCategory,
	translatePriority,
	translateStatus,
} from "../../utils/translations";

interface TicketType {
	id: number;
	title: string;
	status: string;
	priority: string;
	category_id: number;
	created_at: string;
	resolved_at: string | null;
}

export default function Tickets() {
	const [ticket, setTicket] = useState<TicketType[]>([]);
	const navigate = useNavigate();

	useEffect(() => {
		fetchWithToken("http://localhost:3310/api/tickets/")
			.then((response) => response.json())
			.then((data) => setTicket(data))
			.catch((error) => console.error(error));
	}, []);

	return (
		<Box
			sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
		>
			<Typography variant="h4" gutterBottom>
				Tickets List
			</Typography>
			<TableContainer component={Paper} sx={{ width: "80%" }}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>ID</TableCell>
							<TableCell>Titre</TableCell>
							<TableCell>Status</TableCell>
							<TableCell>Priority</TableCell>
							<TableCell>Category</TableCell>
							<TableCell>Created At</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{ticket.map((t) => (
							<TableRow
								key={t.id}
								onClick={() => navigate(`/tickets/${t.id}/edit`)}
								sx={{
									cursor: "pointer",
									"&:hover": { bgcolor: "action.hover" },
								}}
							>
								<TableCell>{t.id}</TableCell>
								<TableCell>{t.title}</TableCell>
								<TableCell>{translateStatus(t.status)}</TableCell>
								<TableCell>{translatePriority(t.priority)}</TableCell>
								<TableCell>{translateCategory(t.category_id)}</TableCell>
								<TableCell>{formatDate(t.created_at)}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</Box>
	);
}
