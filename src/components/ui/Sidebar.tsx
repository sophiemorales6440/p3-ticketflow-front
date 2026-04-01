import AddCircleIcon from "@mui/icons-material/AddCircle";
import BarChartIcon from "@mui/icons-material/BarChart";
import CategoryIcon from "@mui/icons-material/Category";
import ChatIcon from "@mui/icons-material/Chat";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import DashboardIcon from "@mui/icons-material/Dashboard";
import EngineeringIcon from "@mui/icons-material/Engineering";
import GroupIcon from "@mui/icons-material/Group";
import HistoryIcon from "@mui/icons-material/History";
import { Box, IconButton, Tooltip } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

interface NavItem {
	label: string;
	icon: React.ReactNode;
	path: string;
}

const ADMIN_ITEMS: NavItem[] = [
	{ label: "Dashboard", icon: <DashboardIcon />, path: "/admin/dashboard" },
	{ label: "Tickets", icon: <ConfirmationNumberIcon />, path: "/tickets" },
	{ label: "Utilisateurs", icon: <GroupIcon />, path: "/users" },
	{ label: "Techniciens", icon: <EngineeringIcon />, path: "/technicians" },
	{ label: "Catégories", icon: <CategoryIcon />, path: "/categories" },
	{ label: "Statistiques", icon: <BarChartIcon />, path: "/statistics" },
];

const TECHNICIAN_ITEMS: NavItem[] = [
	{
		label: "Dashboard",
		icon: <DashboardIcon />,
		path: "/technician/dashboard",
	},
	{ label: "Tickets", icon: <ConfirmationNumberIcon />, path: "/tickets" },
	{ label: "Historique", icon: <HistoryIcon />, path: "/technician/history" },
	{ label: "Commentaires", icon: <ChatIcon />, path: "/technician/comments" },
];

const CLIENT_ITEMS: NavItem[] = [
	{
		label: "Dashboard",
		icon: <DashboardIcon />,
		path: "/client/dashboard",
	},
	{
		label: "Nouveau ticket",
		icon: <AddCircleIcon />,
		path: "/tickets/new",
	},
	{
		label: "Historique",
		icon: <HistoryIcon />,
		path: "/client/history",
	},
];

const ITEMS_BY_ROLE: Record<string, NavItem[]> = {
	admin: ADMIN_ITEMS,
	technician: TECHNICIAN_ITEMS,
	client: CLIENT_ITEMS,
};

interface Props {
	role: string;
}

export default function Sidebar({ role }: Props) {
	const navigate = useNavigate();
	const location = useLocation();
	const items = ITEMS_BY_ROLE[role] ?? [];

	return (
		<Box
			sx={{
				width: 64,
				minHeight: "100vh",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				py: 3,
				gap: 1,
				bgcolor: "transparent",
			}}
		>
			{items.map((item) => {
				const isActive = location.pathname === item.path;
				return (
					<Tooltip key={item.path} title={item.label} placement="right">
						<IconButton
							onClick={() => navigate(item.path)}
							sx={{
								color: "white",
								opacity: isActive ? 1 : 0.5,
								bgcolor: isActive ? "rgba(255,255,255,0.15)" : "transparent",
								borderRadius: 2,
								width: 44,
								height: 44,
								"&:hover": {
									opacity: 1,
									bgcolor: "rgba(255,255,255,0.1)",
								},
							}}
						>
							{item.icon}
						</IconButton>
					</Tooltip>
				);
			})}
		</Box>
	);
}
