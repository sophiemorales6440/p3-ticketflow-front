import { Avatar, Box, Card, Typography } from "@mui/material";

interface User {
	firstname: string;
	lastname: string;
	email: string;
	password: string;
}

const Profile = ({ currentUser }: { currentUser: User }) => {
	return (
		<Card sx={{ mt: 3, p: 2 }}>
			<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
				<Avatar sx={{ width: 56, height: 56, bgcolor: "primary.main" }}>
					{currentUser?.firstname[0]}
					{currentUser?.lastname[0]}
				</Avatar>
				<Box>
					<Typography variant="h6">
						{currentUser?.firstname} {currentUser?.lastname}
					</Typography>
					<Typography variant="body2" color="text.secondary">
						Email: {currentUser?.email}
					</Typography>
					<Typography variant="body2" color="text.secondary">
						Password: {currentUser?.password}
					</Typography>
				</Box>
			</Box>
		</Card>
	);
};

export default Profile;
