import {
	Drawer,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Legend,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { fetchWithToken } from "../../utils/api";
import StatCard from "../technicien/StatCard";
import type {
	TicketType,
	UserType,
} from "../technicien/TechnicienDashboard.utils";
import TicketDetailPanel from "../technicien/TicketDetailPanel";
import TicketTable from "../technicien/TicketTable";

export default function Dashboard() {
	const [tickets, setTickets] = useState<TicketType[]>([]);
	const [users, setUsers] = useState<UserType[]>([]);
	const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);

	useEffect(() => {
		fetchWithToken(`${import.meta.env.VITE_API_URL}/api/tickets/`)
			.then((response) => response.json())
			.then((data) => {
				setTickets(data);
			})
			.catch((error) => console.error(error));
	}, []);

	useEffect(() => {
		fetchWithToken(`${import.meta.env.VITE_API_URL}/api/users/`)
			.then((response) => response.json())
			.then((data) => setUsers(data))
			.catch((error) => console.error(error));
	}, []);

	const stats = [
		{
			label: "Tickets en cours",
			value: tickets.filter((t) => t.status === "in_progress").length,
			color: "#3b82f6",
		},
		{
			label: "En attente",
			value: tickets.filter((t) => t.status === "open").length,
			color: "#f59e0b",
		},
		{
			label: "Résolus",
			value: tickets.filter((t) => t.status === "resolved").length,
			color: "#22c55e",
		},
		{
			label: "Tickets en retard",
			value: tickets.filter((t) => {
				const days = (Date.now() - new Date(t.created_at).getTime()) / 86400000;
				return days > 3 && t.status !== "resolved" && t.status !== "closed";
			}).length,
			color: "#ef4444",
		},
	];
	const technicians = users.filter((u) => u.role === "technician");

	const ticketsByDay = Object.entries(
		tickets.reduce(
			(acc, ticket) => {
				const day = new Date(ticket.created_at).toLocaleDateString("fr-FR", {
					day: "2-digit",
					month: "2-digit",
					year: "2-digit",
				});
				acc[day] = (acc[day] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>,
		),
	).map(([day, count]) => ({ day, count }));

	const handleStatusChange = (ticketId: number, newStatus: string) => {
		setTickets((prev) =>
			prev.map((t) => (t.id === ticketId ? { ...t, status: newStatus } : t)),
		);
		if (selectedTicket?.id === ticketId) {
			setSelectedTicket((prev) =>
				prev ? { ...prev, status: newStatus } : prev,
			);
		}
	};

	const handleTechnicianChange = (ticketId: number, technicianId: number) => {
		setTickets((prev) =>
			prev.map((t) =>
				t.id === ticketId ? { ...t, technician_id: technicianId } : t,
			),
		);
		if (selectedTicket?.id === ticketId) {
			setSelectedTicket((prev) =>
				prev ? { ...prev, technician_id: technicianId } : prev,
			);
		}
	};

	return (
		<Box sx={{ p: { xs: 2, sm: 3 } }}>
			<Typography variant="h4" gutterBottom>
				DASHBOARD ADMIN
			</Typography>
			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
					gap: 2,
					mb: 4,
				}}
			>
				{stats.map((stat) => (
					<StatCard
						key={stat.label}
						label={stat.label}
						value={stat.value}
						color={stat.color}
					/>
				))}
			</Box>
			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 2fr" },
					gap: 2,
					mb: 4,
				}}
			>
				<Box sx={{ bgcolor: "#ffffff", borderRadius: 2, p: 3, minWidth: 0 }}>
					<Typography
						variant="h6"
						fontWeight={600}
						gutterBottom
						color="text.primary"
					>
						Répartition par statut
					</Typography>
					<ResponsiveContainer width="100%" height={200}>
						<PieChart>
							<Pie
								data={stats}
								dataKey="value"
								nameKey="label"
								cx="50%"
								cy="50%"
								outerRadius={70}
							>
								{stats.map((stat) => (
									<Cell key={stat.label} fill={stat.color} />
								))}
							</Pie>
							<Tooltip />
							<Legend />
						</PieChart>
					</ResponsiveContainer>
				</Box>

				<Box sx={{ bgcolor: "#ffffff", borderRadius: 2, p: 3, minWidth: 0 }}>
					<Typography
						variant="h6"
						fontWeight={600}
						gutterBottom
						color="text.primary"
					>
						Répartition par priorité
					</Typography>
					<ResponsiveContainer width="100%" height={200}>
						<PieChart>
							<Pie
								data={[
									{
										label: "Haut",
										value: tickets.filter((t) => t.priority === "high").length,
										color: "#ef4444",
									},
									{
										label: "Moyen",
										value: tickets.filter((t) => t.priority === "medium")
											.length,
										color: "#f59e0b",
									},
									{
										label: "Bas",
										value: tickets.filter((t) => t.priority === "low").length,
										color: "#22c55e",
									},
								]}
								dataKey="value"
								nameKey="label"
								cx="50%"
								cy="50%"
								outerRadius={70}
							>
								{[
									{ label: "Haut", color: "#ef4444" },
									{ label: "Moyen", color: "#f59e0b" },
									{ label: "Bas", color: "#22c55e" },
								].map((entry) => (
									<Cell key={entry.label} fill={entry.color} />
								))}
							</Pie>
							<Tooltip />
							<Legend />
						</PieChart>
					</ResponsiveContainer>
				</Box>
				<Box sx={{ bgcolor: "#ffffff", borderRadius: 2, p: 3, minWidth: 0 }}>
					<Typography
						variant="h6"
						fontWeight={600}
						gutterBottom
						color="text.primary"
					>
						Tickets créés par jour
					</Typography>
					<ResponsiveContainer width="100%" height={250}>
						<BarChart data={ticketsByDay}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="day" />
							<YAxis allowDecimals={false} />
							<Tooltip />
							<Bar
								dataKey="count"
								name="Tickets"
								fill="#3b82f6"
								radius={[4, 4, 0, 0]}
							/>
						</BarChart>
					</ResponsiveContainer>
				</Box>
			</Box>
			<Typography
				variant="h5"
				fontWeight={800}
				letterSpacing={1}
				gutterBottom
				sx={{ mt: 4 }}
			>
				Tickets
			</Typography>
			<Box
				sx={{
					overflowX: "auto",
				}}
			>
				<TicketTable
					tickets={tickets}
					selectedTicketId={selectedTicket?.id ?? null}
					onSelectTicket={setSelectedTicket}
				/>
			</Box>
			<Drawer
				anchor="right"
				open={!!selectedTicket}
				onClose={() => setSelectedTicket(null)}
			>
				{selectedTicket && (
					<TicketDetailPanel
						ticket={selectedTicket}
						onClose={() => setSelectedTicket(null)}
						onStatusChange={handleStatusChange}
						technicians={technicians}
						onTechnicianChange={handleTechnicianChange}
					/>
				)}
			</Drawer>

			<Typography
				variant="h5"
				fontWeight={800}
				letterSpacing={1}
				gutterBottom
				sx={{ mt: 5 }}
			>
				Techniciens
			</Typography>
			<TableContainer
				component={Box}
				sx={{
					p: 2,
					bgcolor: "background.paper",
					borderRadius: 2,
					maxHeight: 400,
					overflow: "auto",
				}}
			>
				<Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
					{technicians.length} technicien{technicians.length > 1 ? "s" : ""}
				</Typography>
				<Table>
					<TableHead>
						<TableRow sx={{ bgcolor: "#e8f0fe" }}>
							<TableCell
								sx={{ fontWeight: 600, fontSize: 14, color: "text.secondary" }}
							>
								Nom
							</TableCell>
							<TableCell
								sx={{ fontWeight: 600, fontSize: 14, color: "text.secondary" }}
							>
								Prénom
							</TableCell>
							<TableCell
								sx={{ fontWeight: 600, fontSize: 14, color: "text.secondary" }}
							>
								Tickets assignés
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{technicians.map((tech) => (
							<TableRow key={tech.id}>
								<TableCell>{tech.lastname}</TableCell>
								<TableCell>{tech.firstname}</TableCell>
								<TableCell>
									{tickets.filter((t) => t.technician_id === tech.id).length}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</Box>
	);
}
