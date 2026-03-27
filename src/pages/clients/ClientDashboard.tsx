import AddIcon from "@mui/icons-material/Add";
import { Box, Button, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function ClientDashboard() {
	const navigate = useNavigate();

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
			</Box>
		</Container>
	);
}
