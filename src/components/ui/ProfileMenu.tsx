import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import InfoIcon from "@mui/icons-material/Info";
import LogoutIcon from "@mui/icons-material/Logout";
import {
	Avatar,
	Box,
	Divider,
	ListItemIcon,
	Menu,
	MenuItem,
	Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProfileMenu() {
	const { user, handleLogout } = useAuth();
	const navigate = useNavigate();
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleDisconnect = () => {
		handleLogout();
		navigate("/login");
		handleClose();
	};

	const handleMyInfos = () => {
		navigate("/profile");
		handleClose();
	};

	return (
		<>
			{/* Bouton profil cliquable */}
			<Box
				onClick={handleOpen}
				sx={{
					display: "flex",
					alignItems: "center",
					gap: 1,
					ml: 1,
					cursor: "pointer",
					px: 1.5,
					py: 0.5,
					borderRadius: 2,
					"&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
				}}
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

			{/* Menu déroulant */}
			<Menu
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				transformOrigin={{ horizontal: "right", vertical: "top" }}
				anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
				PaperProps={{
					elevation: 3,
					sx: {
						mt: 1,
						minWidth: 200,
						borderRadius: 2,
						overflow: "visible",
					},
				}}
			>
				{/* Infos utilisateur */}
				<Box sx={{ px: 2, py: 1.5 }}>
					<Typography variant="subtitle2" fontWeight={600}>
						{user?.email}
					</Typography>
					<Typography variant="caption" color="text.secondary">
						{user?.role === "admin"
							? "Administrateur"
							: user?.role === "technician"
								? "Technicien"
								: "Client"}
					</Typography>
				</Box>

				<Divider />

				<MenuItem onClick={handleMyInfos} sx={{ py: 1.5 }}>
					<ListItemIcon>
						<InfoIcon fontSize="small" />
					</ListItemIcon>
					<Typography variant="body2">Mes informations</Typography>
				</MenuItem>

				<Divider />

				<MenuItem
					onClick={handleDisconnect}
					sx={{ py: 1.5, color: "error.main" }}
				>
					<ListItemIcon>
						<LogoutIcon fontSize="small" color="error" />
					</ListItemIcon>
					<Typography variant="body2">Se déconnecter</Typography>
				</MenuItem>
			</Menu>
		</>
	);
}
