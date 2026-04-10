import MailIcon from "@mui/icons-material/Mail";
import SearchIcon from "@mui/icons-material/Search";
import SettingsIcon from "@mui/icons-material/Settings";
import { Box, IconButton, InputAdornment, TextField } from "@mui/material";
import NotificationPanel from "./NotificationPanel";
import ProfileMenu from "./ProfileMenu";

export default function Navbar() {
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

			<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
				<NotificationPanel />
				<IconButton sx={{ color: "white", opacity: 0.7 }}>
					<MailIcon />
				</IconButton>
				<IconButton sx={{ color: "white", opacity: 0.7 }}>
					<SettingsIcon />
				</IconButton>
				<ProfileMenu />
			</Box>
		</Box>
	);
}
