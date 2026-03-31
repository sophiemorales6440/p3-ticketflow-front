import { Box, Card, Typography } from "@mui/material";

export default function Dashboard() {
	return (
		<Box sx={{ p: 3 }}>
			<Typography variant="h4" gutterBottom>
				Bonjour X, voici votre dashboard Admin
			</Typography>
			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: "1fr 1fr 1fr 1fr",
					gap: "12px",
					mb: 3,
				}}
			>
				<Card sx={{ p: 2, bgcolor: "#00FFD1", color: "white" }}>
					<Typography sx={{ fontSize: "11px", color: "text.secondary" }}>
						Utilisateurs
					</Typography>
					<Typography sx={{ fontSize: "26px", fontWeight: 700 }}>12</Typography>
					<Typography sx={{ fontSize: "11px", color: "text.disabled" }}>
						+ 3 ce mois
					</Typography>
				</Card>
				<Card sx={{ p: 2, bgcolor: "#FF6B6B", color: "white" }}>
					<Typography sx={{ fontSize: "11px", color: "text.secondary" }}>
						Ticket en cours
					</Typography>
					<Typography sx={{ fontSize: "26px", fontWeight: 700 }}>47</Typography>
					<Typography sx={{ fontSize: "11px", color: "text.disabled" }}>
						12 en attente
					</Typography>
				</Card>
				<Card sx={{ p: 2, bgcolor: "#FFD93D", color: "white" }}>
					<Typography sx={{ fontSize: "11px", color: "text.secondary" }}>
						Catégories
					</Typography>
					<Typography sx={{ fontSize: "26px", fontWeight: 700 }}>9</Typography>
					<Typography sx={{ fontSize: "11px", color: "text.disabled" }}>
						2 inactives
					</Typography>
				</Card>
				<Card sx={{ p: 2, bgcolor: "#A78BFA", color: "white" }}>
					<Typography sx={{ fontSize: "11px", color: "text.secondary" }}>
						Tickets résolus
					</Typography>
					<Typography sx={{ fontSize: "26px", fontWeight: 700 }}>
						203
					</Typography>
					<Typography sx={{ fontSize: "11px", color: "text.disabled" }}>
						Taux 87%
					</Typography>
				</Card>
			</Box>
		</Box>
	);
}
