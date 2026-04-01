import { Drawer, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { fetchWithToken } from "../../utils/api";
import StatCard from "../technicien/StatCard";
import type { TicketType } from "../technicien/TechnicienDashboard.utils";
import TicketDetailPanel from "../technicien/TicketDetailPanel";
import TicketTable from "../technicien/TicketTable";

interface UserType {
	id: number;
	firstname: string;
	lastname: string;
	role: string;
}

export default function Dashboard() {
	const [tickets, setTickets] = useState<TicketType[]>([]);
	const [users, setUsers] = useState<UserType[]>([]);
	const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);

	useEffect(() => {
		fetchWithToken("http://localhost:3310/api/tickets/")
			.then((response) => response.json())
			.then((data) => setTickets(data))
			.catch((error) => console.error(error));
	}, []);

	useEffect(() => {
		fetchWithToken("http://localhost:3310/api/users/")
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

	return (
		<Box sx={{ p: 3 }}>
			<Typography variant="h4" gutterBottom>
				DASHBOARD ADMIN
			</Typography>
			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: "repeat(4, 1fr)",
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
			<TicketTable
				tickets={tickets}
				selectedTicketId={selectedTicket?.id ?? null}
				onSelectTicket={setSelectedTicket}
			/>
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
					/>
				)}
			</Drawer>

			<Typography variant="h5" fontWeight={600} gutterBottom sx={{ mt: 5 }}>
				Techniciens
			</Typography>

			{technicians.map((technician) => (
				<Box key={technician.id} sx={{ mb: 2 }}>
					<Typography variant="body1">
						{technician.firstname} {technician.lastname}
					</Typography>
					<Typography variant="body2" color="text.secondary">
						Tickets assignés:{" "}
						{tickets.filter((t) => t.technician_id === technician.id).length}
					</Typography>
				</Box>
			))}
		</Box>
	);
}
