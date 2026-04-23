import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

// ─── Config des réseaux sociaux ───────────────────────────────────────────────

const SOCIAL_LINKS = [
	{
		icon: <TwitterIcon fontSize="small" />,
		href: "https://twitter.com/",
		label: "Twitter",
	},
	{
		icon: <InstagramIcon fontSize="small" />,
		href: "https://instagram.com/",
		label: "Instagram",
	},
] as const;

// ─── Footer ───────────────────────────────────────────────────────────────────

export default function Footer() {
	return (
		<Box
			component="footer"
			sx={{
				py: 3,
				borderTop: "1px solid rgba(255,255,255,0.15)",
				color: "white",
			}}
		>
			<Stack
				direction="row"
				alignItems="center"
				justifyContent="space-between"
				sx={{ maxWidth: "lg", mx: "auto", px: 3 }}
			>
				{/* Copyright */}
				<Typography variant="body2" sx={{ color: "white" }}>
					© {new Date().getFullYear()}{" "}
					<Link
						href="https://yourwebsite.com"
						color="inherit"
						underline="hover"
					>
						TicketFlow
					</Link>
				</Typography>

				{/* Icônes réseaux sociaux */}
				<Stack direction="row" spacing={1}>
					{SOCIAL_LINKS.map(({ icon, href, label }) => (
						<IconButton
							key={label}
							href={href}
							target="_blank"
							rel="noopener noreferrer"
							aria-label={label}
							size="small"
							sx={{
								color: "white",
								"&:hover": { color: "white" },
							}}
						>
							{icon}
						</IconButton>
					))}
				</Stack>
			</Stack>
		</Box>
	);
}
