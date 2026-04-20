import { Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";

interface Props {
	label: string;
	value: number;
	color: string;
	icon: React.ElementType;
	onClick?: () => void;
	active?: boolean;
}

export default function StatCard({
	label,
	value,
	color,
	icon: Icon,
	onClick,
	active,
}: Props) {
	return (
		<Paper
			elevation={active ? 4 : 0}
			onClick={onClick}
			sx={{
				p: 2.5,
				borderRadius: 2,
				border: "1px solid",
				borderColor: active ? color : "divider",
				borderLeft: `4px solid ${color}`,
				cursor: onClick ? "pointer" : "default",
				transition: "all 0.2s",
				"&:hover": onClick ? { boxShadow: 3 } : {},
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
				<Icon
					sx={{ color, opacity: active ? 0.8 : 0.4, fontSize: 36, mt: 0.5 }}
				/>
			</Box>
		</Paper>
	);
}
