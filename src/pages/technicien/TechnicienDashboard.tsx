import { Box, Container, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { fetchWithToken } from "../../utils/api";
import StatCard from "./StatCard";
import type { TicketType } from "./TechnicienDashboard.utils";
import TicketDetailPanel from "./TicketDetailPanel";
import TicketTable from "./TicketTable";

export default function TechnicienDashboard() {
	const { user } = useAuth();
	const [tickets, setTickets] = useState<TicketType[]>([]);
	const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);

	useEffect(() => {
		if (!user?.id) return;
		fetchWithToken(
			`${import.meta.env.VITE_API_URL}/api/tickets/technician/${user.id}`,
		)
			.then((res) => res.json())
			.then((data) => setTickets(data))
			.catch((err) => console.error(err));
	}, [user]);

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

	return (
		<Container maxWidth="xl" sx={{ py: 4 }}>
			<Typography variant="h5" fontWeight={600} mb={1}>
				Tableau de bord —{" "}
				<Typography
					component="span"
					variant="h5"
					color="text.secondary"
					fontWeight={400}
				>
					Technicien SAV
				</Typography>
			</Typography>
			<Typography variant="body2" color="text.secondary" mb={3}>
				Bonjour {user?.email ?? "Technicien"}, voici vos tickets du jour.
			</Typography>

			{/* Cards stats */}
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

			{/* Corps principal */}
			<Box sx={{ display: "flex", gap: 3, alignItems: "flex-start" }}>
				<Box sx={{ flex: 1, minWidth: 0 }}>
					<TicketTable
						tickets={tickets}
						selectedTicketId={selectedTicket?.id ?? null}
						onSelectTicket={(ticket) =>
							setSelectedTicket(
								selectedTicket?.id === ticket.id ? null : ticket,
							)
						}
					/>
				</Box>

				{selectedTicket && (
					<TicketDetailPanel
						ticket={selectedTicket}
						onClose={() => setSelectedTicket(null)}
						onStatusChange={handleStatusChange}
						technicians={[]} // Pas besoin de la liste des techniciens pour le technicien
						onTechnicianChange={() => {}} // Pas besoin de changer de technicien pour le technicien
					/>
				)}
			</Box>
		</Container>
	);
}
