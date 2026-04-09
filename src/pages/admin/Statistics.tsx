import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Legend,
	Line,
	LineChart,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { fetchWithToken } from "../../utils/api";

interface MonthStats {
	month: string;
	count: number;
}
interface StatusStats {
	status: string;
	count: number;
}
interface PriorityStats {
	priority: string;
	count: number;
}
interface Stats {
	byStatus: StatusStats[];
	byPriority: PriorityStats[];
	createdByMonth: MonthStats[];
	resolvedByMonth: MonthStats[];
}

const STATUS_COLORS: Record<string, string> = {
	open: "#f59e0b",
	in_progress: "#3b82f6",
	resolved: "#22c55e",
	closed: "#6b7280",
};
const STATUS_LABEL: Record<string, string> = {
	open: "En attente",
	in_progress: "En cours",
	resolved: "Résolus",
	closed: "Fermés",
};
const PRIORITY_COLORS: Record<string, string> = {
	low: "#22c55e",
	medium: "#f59e0b",
	high: "#ef4444",
	critical: "#7c3aed",
};
const PRIORITY_LABEL: Record<string, string> = {
	low: "Faible",
	medium: "Moyenne",
	high: "Haute",
	critical: "Critique",
};

export default function Statistics() {
	const [stats, setStats] = useState<Stats | null>(null);

	useEffect(() => {
		fetchWithToken(`${import.meta.env.VITE_API_URL}/api/tickets/stats`)
			.then((res) => res.json())
			.then((data) => setStats(data))
			.catch((err) => console.error(err));
	}, []);

	if (!stats)
		return (
			<Box sx={{ p: 3 }}>
				<Typography>Chargement des statistiques...</Typography>
			</Box>
		);

	const byStatus = stats.byStatus.map((s) => ({
		...s,
		label: STATUS_LABEL[s.status] ?? s.status,
		color: STATUS_COLORS[s.status] ?? "#8884d8",
	}));

	const byPriority = stats.byPriority.map((p) => ({
		...p,
		label: PRIORITY_LABEL[p.priority] ?? p.priority,
		color: PRIORITY_COLORS[p.priority] ?? "#8884d8",
	}));

	return (
		<Box sx={{ p: { xs: 2, sm: 3 } }}>
			<Typography variant="h4" fontWeight={800} gutterBottom color="white">
				STATISTIQUES
			</Typography>

			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
					gap: 3,
					mb: 3,
				}}
			>
				{/* Répartition par statut */}
				<Box sx={{ bgcolor: "#ffffff", borderRadius: 2, p: 3 }}>
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
								data={byStatus}
								dataKey="count"
								nameKey="label"
								cx="50%"
								cy="50%"
								outerRadius={70}
							>
								{byStatus.map((s) => (
									<Cell key={s.status} fill={s.color} />
								))}
							</Pie>
							<Tooltip />
							<Legend />
						</PieChart>
					</ResponsiveContainer>
				</Box>

				{/* Répartition par priorité */}
				<Box sx={{ bgcolor: "#ffffff", borderRadius: 2, p: 3 }}>
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
								data={byPriority}
								dataKey="count"
								nameKey="label"
								cx="50%"
								cy="50%"
								outerRadius={70}
							>
								{byPriority.map((p) => (
									<Cell key={p.priority} fill={p.color} />
								))}
							</Pie>
							<Tooltip />
							<Legend />
						</PieChart>
					</ResponsiveContainer>
				</Box>

				{/* Tickets créés par mois */}
				<Box sx={{ bgcolor: "#ffffff", borderRadius: 2, p: 3 }}>
					<Typography
						variant="h6"
						fontWeight={600}
						gutterBottom
						color="text.primary"
					>
						Tickets créés par mois
					</Typography>
					<ResponsiveContainer width="100%" height={250}>
						<BarChart data={stats.createdByMonth}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="month" />
							<YAxis allowDecimals={false} />
							<Tooltip />
							<Bar
								dataKey="count"
								name="Créés"
								fill="#3b82f6"
								radius={[4, 4, 0, 0]}
							/>
						</BarChart>
					</ResponsiveContainer>
				</Box>

				{/* Tickets résolus par mois */}
				<Box sx={{ bgcolor: "#ffffff", borderRadius: 2, p: 3 }}>
					<Typography
						variant="h6"
						fontWeight={600}
						gutterBottom
						color="text.primary"
					>
						Tickets résolus par mois
					</Typography>
					<ResponsiveContainer width="100%" height={250}>
						<LineChart data={stats.resolvedByMonth}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="month" />
							<YAxis allowDecimals={false} />
							<Tooltip />
							<Line
								type="monotone"
								dataKey="count"
								name="Résolus"
								stroke="#22c55e"
								strokeWidth={2}
								dot={{ r: 4 }}
							/>
						</LineChart>
					</ResponsiveContainer>
				</Box>
			</Box>
		</Box>
	);
}
