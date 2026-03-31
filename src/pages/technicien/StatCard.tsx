import { Paper, Typography } from "@mui/material";

interface Props {
	label: string;
	value: number;
	color: string;
}

export default function StatCard({ label, value, color }: Props) {
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
			<Typography variant="body2" color="text.secondary" mb={0.5}>
				{label}
			</Typography>
			<Typography variant="h4" fontWeight={700} sx={{ color }}>
				{value}
			</Typography>
		</Paper>
	);
}
