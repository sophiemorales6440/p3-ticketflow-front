import { Box } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import Footer from "./Footer";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

interface Props {
	children: React.ReactNode;
}

export default function Layout({ children }: Props) {
	const { user } = useAuth();

	if (!user) return null;

	return (
		<Box
			sx={{
				display: "flex",
				minHeight: "100vh",
			}}
		>
			{/* Sidebar */}
			<Sidebar role={user.role} />

			{/* Contenu principal */}
			<Box
				sx={{
					flex: 1,
					minWidth: 0,
					display: "flex",
					flexDirection: "column",
				}}
			>
				{/* Navbar */}
				<Navbar />

				{/* Fenêtre glassmorphism */}
				<Box
					sx={{
						flex: 1,
						minWidth: 0,
						display: "flex",
						flexDirection: "column",
						overflow: "hidden",
						m: 2,
						borderRadius: 3,
						bgcolor: "rgba(255,255,255,0.15)",
						backdropFilter: "blur(12px)",
						border: "1px solid rgba(255,255,255,0.2)",
						p: 2,
					}}
				>
					{children}
				</Box>
				<Footer />
			</Box>
		</Box>
	);
}
