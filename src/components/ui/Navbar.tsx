import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/Search";
import SettingsIcon from "@mui/icons-material/Settings";
import {
	Avatar,
	Badge,
	Box,
	IconButton,
	InputAdornment,
	TextField,
	Typography,
} from "@mui/material";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
	const { user, handleLogout } = useAuth();

	return (
		<Box
			sx={{
				height: 60,
				display: "flex",
				alignItems: "center",
				justifyContent: "space-between",
				px: 3,
				borderBottom: "1px solid rgba(255,255,255,0.1)",
			}}
		>
			{/* Barre de recherche */}
			<TextField
				size="small"
				placeholder="Rechercher un ticket..."
				sx={{
					width: 320,
					"& .MuiOutlinedInput-root": {
						bgcolor: "rgba(255,255,255,0.1)",
						borderRadius: 2,
						color: "white",
						"& fieldset": { border: "none" },
						"&:hover fieldset": { border: "none" },
						"&.Mui-focused fieldset": { border: "none" },
					},
					"& input::placeholder": { color: "rgba(255,255,255,0.5)" },
				}}
				InputProps={{
					startAdornment: (
						<InputAdornment position="start">
							<SearchIcon sx={{ color: "rgba(255,255,255,0.5)" }} />
						</InputAdornment>
					),
				}}
			/>

			{/* Icônes droite + profil */}
			<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
				<IconButton sx={{ color: "white", opacity: 0.7 }}>
					<Badge badgeContent={3} color="error">
						<NotificationsIcon />
					</Badge>
				</IconButton>
				<IconButton sx={{ color: "white", opacity: 0.7 }}>
					<MailIcon />
				</IconButton>
				<IconButton sx={{ color: "white", opacity: 0.7 }}>
					<SettingsIcon />
				</IconButton>

				{/* Profil */}
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						gap: 1,
						ml: 1,
						cursor: "pointer",
						"&:hover": { opacity: 0.8 },
					}}
					onClick={handleLogout}
				>
					<Avatar
						sx={{
							width: 32,
							height: 32,
							bgcolor: "rgba(255,255,255,0.2)",
						}}
					>
						<AccountCircleIcon fontSize="small" />
					</Avatar>
					<Typography variant="body2" color="white" fontWeight={500}>
						{user?.email ?? "Profil"}
					</Typography>
				</Box>
			</Box>
		</Box>
	);
}
