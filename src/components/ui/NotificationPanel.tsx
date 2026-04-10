import NotificationsIcon from "@mui/icons-material/Notifications";
import {
	Badge,
	Box,
	Divider,
	IconButton,
	Menu,
	Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { STATUS_LABELS } from "../../pages/technicien/TechnicienDashboard.utils";
import { fetchWithToken } from "../../utils/api";

interface TicketSnapshot {
	id: number;
	status: string;
	title: string;
}

interface Notification {
	id: number;
	ticketId: number;
	ticketTitle: string;
	oldStatus: string;
	newStatus: string;
	seenAt: string;
}

const POLLING_INTERVAL = 30000;

export default function NotificationPanel() {
	const { user } = useAuth();
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const previousTickets = useRef<TicketSnapshot[]>([]);
	const open = Boolean(anchorEl);

	const getApiUrl = () => {
		if (!user) return null;
		if (user.role === "technician") {
			return `http://localhost:3310/api/tickets/technician/${user.id}`;
		}
		if (user.role === "client") {
			return `http://localhost:3310/api/tickets/`;
		}
		return `http://localhost:3310/api/tickets/`;
	};

	const checkForChanges = async () => {
		const url = getApiUrl();
		if (!url) return;

		try {
			const res = await fetchWithToken(url);
			const data: TicketSnapshot[] = await res.json();

			const tickets =
				user?.role === "client"
					? data.filter(
							(t) =>
								(t as unknown as { client_id: number }).client_id === user.id,
						)
					: data;

			if (previousTickets.current.length > 0) {
				const newNotifs: Notification[] = [];

				for (const ticket of tickets) {
					const prev = previousTickets.current.find((p) => p.id === ticket.id);
					if (prev && prev.status !== ticket.status) {
						newNotifs.push({
							id: Date.now() + ticket.id,
							ticketId: ticket.id,
							ticketTitle: ticket.title,
							oldStatus: prev.status,
							newStatus: ticket.status,
							seenAt: new Date().toLocaleTimeString("fr-FR"),
						});
					}
				}

				if (newNotifs.length > 0) {
					setNotifications((prev) => [...newNotifs, ...prev]);
				}
			}

			previousTickets.current = tickets.map((t) => ({
				id: t.id,
				status: t.status,
				title: t.title,
			}));
		} catch (err) {
			console.error("Erreur polling notifs:", err);
		}
	};

	useEffect(() => {
		if (!user) return;
		checkForChanges();
		const interval = setInterval(checkForChanges, POLLING_INTERVAL);
		return () => clearInterval(interval);
	}, [user]);

	const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleClear = () => {
		setNotifications([]);
		handleClose();
	};

	return (
		<>
			<IconButton
				onClick={handleOpen}
				sx={{ color: "white", opacity: 0.7, "&:hover": { opacity: 1 } }}
			>
				<Badge badgeContent={notifications.length} color="error">
					<NotificationsIcon />
				</Badge>
			</IconButton>

			<Menu
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				transformOrigin={{ horizontal: "right", vertical: "top" }}
				anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
				PaperProps={{
					elevation: 3,
					sx: { mt: 1, width: 320, borderRadius: 2 },
				}}
			>
				<Box
					sx={{
						px: 2,
						py: 1.5,
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
					}}
				>
					<Typography variant="subtitle2" fontWeight={600}>
						Notifications
					</Typography>
					{notifications.length > 0 && (
						<Typography
							variant="caption"
							color="primary"
							sx={{ cursor: "pointer" }}
							onClick={handleClear}
						>
							Tout effacer
						</Typography>
					)}
				</Box>

				<Divider />

				{notifications.length === 0 ? (
					<Box sx={{ px: 2, py: 3, textAlign: "center" }}>
						<Typography variant="body2" color="text.secondary">
							Aucune notification
						</Typography>
					</Box>
				) : (
					notifications.map((notif) => (
						<Box key={notif.id}>
							<Box sx={{ px: 2, py: 1.5 }}>
								<Typography variant="body2" fontWeight={500}>
									Ticket #{notif.ticketId} — {notif.ticketTitle}
								</Typography>
								<Typography variant="caption" color="text.secondary">
									Statut passé de{" "}
									<strong>{STATUS_LABELS[notif.oldStatus]}</strong> à{" "}
									<strong>{STATUS_LABELS[notif.newStatus]}</strong>
								</Typography>
								<Typography
									variant="caption"
									color="text.disabled"
									display="block"
								>
									{notif.seenAt}
								</Typography>
							</Box>
							<Divider />
						</Box>
					))
				)}
			</Menu>
		</>
	);
}
