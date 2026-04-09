import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import {
	Box,
	Button,
	IconButton,
	List,
	ListItem,
	ListItemText,
	Paper,
	Typography,
} from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { fetchWithToken } from "../../utils/api";

export interface Attachment {
	id: string;
	filename: string;
	url?: string;
	createdAt?: string;
}

type Props = {
	ticketId: string;
};

export default function AttachmentsPanel({ ticketId }: Props) {
	const [attachments, setAttachments] = useState<Attachment[]>([]);
	const [loading, setLoading] = useState(false);
	const [uploading, setUploading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	const fetchAttachments = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const res = await fetchWithToken(
				`${import.meta.env.VITE_API_URL}/api/tickets/${ticketId}/attachments`,
			);
			if (!res.ok) throw new Error("Erreur lors du chargement");
			const data = await res.json();
			setAttachments(data);
		} catch (err) {
			setError((err as Error).message);
		} finally {
			setLoading(false);
		}
	}, [ticketId]);

	useEffect(() => {
		if (ticketId) fetchAttachments();
	}, [ticketId, fetchAttachments]);

	const handleFileSelect = useCallback(
		(files: FileList | null) => {
			if (!files || files.length === 0) return;
			const file = files[0];

			const formData = new FormData();
			formData.append("file", file);

			void (async () => {
				setUploading(true);
				setError(null);
				try {
					const res = await fetchWithToken(
						`${import.meta.env.VITE_API_URL}/api/attachments/tickets/${ticketId}/attachments`,
						{
							method: "POST",
							body: formData,
						},
					);

					if (!res.ok) throw new Error("Échec de l'upload");

					const created = await res.json();
					setAttachments((prev) => [created, ...prev]);
				} catch (err) {
					setError((err as Error).message);
				} finally {
					setUploading(false);
					if (fileInputRef.current) fileInputRef.current.value = "";
				}
			})();
		},
		[ticketId],
	);

	const handleDelete = useCallback(async (id: string) => {
		if (!confirm("Supprimer cette pièce jointe ?")) return;
		try {
			const res = await fetchWithToken(
				`${import.meta.env.VITE_API_URL}/api/attachments/attachments/${id}`,
				{ method: "DELETE" },
			);
			if (!res.ok) throw new Error("Impossible de supprimer");
			setAttachments((prev) => prev.filter((a) => a.id !== id));
		} catch (err) {
			setError((err as Error).message);
		}
	}, []);

	return (
		<Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
			<Box display="flex" justifyContent="space-between" mb={1}>
				<Typography variant="h6">Pièces jointes</Typography>

				<Box>
					<input
						ref={fileInputRef}
						type="file"
						style={{ display: "none" }}
						onChange={(e) => handleFileSelect(e.target.files)}
					/>
					<Button
						startIcon={<CloudUploadIcon />}
						onClick={() => fileInputRef.current?.click()}
						disabled={uploading || loading}
						size="small"
						variant="contained"
					>
						{uploading ? "Envoi..." : "Ajouter"}
					</Button>
				</Box>
			</Box>

			{error && (
				<Typography color="error" mb={1}>
					{error}
				</Typography>
			)}

			{loading ? (
				<Typography>Chargement...</Typography>
			) : attachments.length === 0 ? (
				<Typography color="text.secondary">
					Aucune pièce jointe pour ce ticket.
				</Typography>
			) : (
				<List dense>
					{attachments.map((att) => (
						<ListItem
							key={att.id}
							divider
							secondaryAction={
								<IconButton
									edge="end"
									onClick={() => handleDelete(att.id)}
									size="small"
								>
									<DeleteIcon />
								</IconButton>
							}
						>
							<ListItemText
								primary={
									<a
										style={{ color: "#1976d2", fontWeight: 800 }}
										href={att.url}
										download={att.filename}
									>
										{att.filename}
									</a>
								}
								secondary={
									att.createdAt
										? new Date(att.createdAt).toLocaleString()
										: undefined
								}
							/>
						</ListItem>
					))}
				</List>
			)}
		</Paper>
	);
}
