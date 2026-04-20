import { Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";

interface Props {
	label: string;
	value: number;
	color: string;
	icon: React.ElementType;
}

export default function StatCard({ label, value, color, icon: Icon }: Props) {
	return (
		<Paper
			elevation={0}
			sx={{
				p: 2.5,
				borderRadius: 2,
				border: "1px solid",
				borderColor: "divider",
				borderLeft: `4px solid ${color}`,
			}}
		>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "flex-start",
				}}
			>
				<Box>
					<Typography variant="body2" color="text.secondary" mb={0.5}>
						{label}
					</Typography>
					<Typography variant="h4" fontWeight={700} sx={{ color }}>
						{value}
					</Typography>
				</Box>
				<Icon sx={{ color, opacity: 0.4, fontSize: 36, mt: 0.5 }} />
			</Box>
		</Paper>
	);
}
