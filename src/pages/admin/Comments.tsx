import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import {
	Avatar,
	Box,
	Checkbox,
	FormControlLabel,
	IconButton,
	InputAdornment,
	List,
	ListItem,
	Paper,
	TextField,
	Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { fetchWithToken } from "../../utils/api";

interface CommentType {
	id: number;
	content: string;
	author_id: number;
	ticket_id: number;
	created_at: string;
	is_internal: number;
}

interface CommentsProps {
	ticketId: number;
}

export default function Comments({ ticketId }: CommentsProps) {
	const [comment, setComment] = useState<CommentType[]>([]);
	const [input, setInput] = useState("");
	const [isInternal, setIsInternal] = useState(false);
	const userRole: string = "technician";

	useEffect(() => {
		const afficheComments = async () => {
			const response = await fetchWithToken(
				`http://localhost:3310/api/comments/ticket/${ticketId}`,
			);
			const data = await response.json();
			setComment(data);
		};
		afficheComments();
	}, [ticketId]);

	const handleDelete = async (id: number) => {
		const response = await fetchWithToken(
			`http://localhost:3310/api/comments/${id}`,
			{
				method: "DELETE",
			},
		);
		if (response.ok) {
			setComment(comment.filter((c) => c.id !== id));
		}
	};

	const sendMessage = async () => {
		const response = await fetchWithToken(
			`http://localhost:3310/api/comments`,
			{
				method: "POST",
				body: JSON.stringify({
					content: input,
					author_id: 1,
					ticket_id: ticketId,
					is_internal: isInternal,
				}),
			},
		);
		if (response.ok) {
			const nouveauComment = await response.json();
			setComment([...comment, nouveauComment]);
			setInput("");
			setIsInternal(false);
		}
	};

	return (
		<Paper
			elevation={0}
			sx={{
				display: "flex",
				flexDirection: "column",
				height: 520,
				border: "1px solid",
				borderColor: "divider",
				borderRadius: 3,
				overflow: "hidden",
			}}
		>
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					gap: 1.5,
					px: 2,
					py: 1.5,
					borderBottom: "1px solid",
					borderColor: "divider",
					bgcolor: "grey.50",
				}}
			>
				<Avatar
					sx={{
						bgcolor: "primary.light",
						color: "primary.dark",
						width: 36,
						height: 36,
					}}
				>
					S
				</Avatar>
				<Box>
					<Typography variant="subtitle2">Support TicketFlow</Typography>
					<Typography variant="caption" color="success.main">
						● En ligne
					</Typography>
				</Box>
			</Box>
			<List
				sx={{
					flex: 1,
					overflowY: "auto",
					px: 2,
					py: 1,
					display: "flex",
					flexDirection: "column",
					gap: 1,
				}}
			>
				{comment.map((msg) => {
					const isUser = msg.author_id === 1;
					return (
						<ListItem
							key={msg.id}
							sx={{
								display: "flex",
								flexDirection: isUser ? "row-reverse" : "row",
								alignItems: "flex-end",
								gap: 1,
								p: 0,
							}}
						>
							<Box
								sx={{
									display: "flex",
									flexDirection: "column",
									alignItems: isUser ? "flex-end" : "flex-start",
								}}
							>
								<Box
									sx={{
										display: "flex",
										alignItems: "center",
										gap: 0.5,
										mb: 0.5,
									}}
								>
									<Avatar
										sx={{
											width: 20,
											height: 20,
											fontSize: 10,
											bgcolor: isUser ? "success.light" : "primary.light",
											color: isUser ? "success.dark" : "primary.dark",
										}}
									>
										{isUser ? "M" : "S"}
									</Avatar>
									<Typography variant="caption" color="text.disabled">
										{msg.created_at}
									</Typography>
								</Box>
								<Paper
									elevation={0}
									sx={{
										px: 1.5,
										py: 1,
										maxWidth: 280,
										bgcolor: isUser ? "primary.main" : "grey.100",
										color: isUser ? "primary.contrastText" : "text.primary",
										borderRadius: isUser
											? "16px 16px 4px 16px"
											: "16px 16px 16px 4px",
									}}
								>
									<Typography variant="body2">{msg.content}</Typography>
								</Paper>
								<IconButton color="error" onClick={() => handleDelete(msg.id)}>
									<DeleteIcon fontSize="small" />
								</IconButton>
							</Box>
						</ListItem>
					);
				})}
			</List>
			<Box
				sx={{ px: 2, py: 1.5, borderTop: "1px solid", borderColor: "divider" }}
			>
				{(userRole === "admin" || userRole === "technician") && (
					<FormControlLabel
						control={
							<Checkbox
								size="small"
								checked={isInternal}
								onChange={(e) => setIsInternal(e.target.checked)}
							/>
						}
						label="Commentaire interne"
					/>
				)}
				<TextField
					fullWidth
					size="small"
					placeholder="Écrire un commentaire..."
					value={input}
					onChange={(e) => setInput(e.target.value)}
					onKeyDown={(e) => e.key === "Enter" && input.trim() && sendMessage()}
					sx={{ "& .MuiOutlinedInput-root": { borderRadius: 5 } }}
					slotProps={{
						input: {
							endAdornment: (
								<InputAdornment position="end">
									<IconButton
										size="small"
										color="primary"
										onClick={sendMessage}
										disabled={!input.trim()}
									>
										<SendIcon fontSize="small" />
									</IconButton>
								</InputAdornment>
							),
						},
					}}
				/>
			</Box>
		</Paper>
	);
}
