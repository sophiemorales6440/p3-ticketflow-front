import AddIcon from "@mui/icons-material/Add";
import {
	Box,
	Button,
	Container,
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

export default function ClientDashboard() {
	const [ticket, setTicket] = useState<TicketType[]>([]);
	const navigate = useNavigate();
	const { user } = useAuth();

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

	return (
		<Container maxWidth="lg">
			<Box sx={{ mt: 4 }}>
				<Typography variant="h4" component="h1" gutterBottom>
					Bonjour Client x, ceci est votre dashboard
				</Typography>

				<Button
					variant="contained"
					startIcon={<AddIcon />}
					onClick={() => navigate("/tickets/new")}
				>
					Nouveau Ticket
				</Button>

				<Typography variant="h4" gutterBottom>
					Mes tickets en cours
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
							{ticket.map((myTicket) => (
								<TableRow
									key={myTicket.id}
									onClick={() => navigate(`/tickets/${myTicket.id}/edit`)}
									sx={{
										cursor: "pointer",
										"&:hover": { bgcolor: "action.hover" },
									}}
								>
									<TableCell>{myTicket.id}</TableCell>
									<TableCell>{myTicket.title}</TableCell>
									<TableCell>{translateStatus(myTicket.status)}</TableCell>
									<TableCell>{translatePriority(myTicket.priority)}</TableCell>
									<TableCell>{myTicket.category_name}</TableCell>
									<TableCell>{formatDate(myTicket.created_at)}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</Box>
		</Container>
	);
}
