// src/pages/admin/AttachmentsPanel.tsx
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
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export interface Attachment {
	id: string;
	filename: string;
	url?: string;
	createdAt?: string;
	size?: number;
	mimeType?: string;
}

type Props = {
	ticketId: string;
};

export default function AttachmentsPanel({ ticketId }: Props) {
	const [attachments, setAttachments] = useState<Attachment[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [uploading, setUploading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	const fetchAttachments = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const res = await fetch(
				`/api/tickets/${encodeURIComponent(ticketId)}/attachments`,
			);
			if (!res.ok) {
				throw new Error(
					`Erreur lors du chargement des pièces jointes (${res.status})`,
				);
			}
			const data: Attachment[] = await res.json();
			setAttachments(data);
		} catch (err) {
			setError((err as Error).message);
		} finally {
			setLoading(false);
		}
	}, [ticketId]);

  useEffect(() => {
    if (!ticketId) {
      setAttachments([]);
      return;
    }
    void fetchAttachments();
  }, [ticketId, fetchAttachments]);

  const handleFileSelect = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;
      const file = files[0];
      void (async () => {
        setUploading(true);
        setError(null);
        try {
          const form = new FormData();
          form.append("file", file);
          const res = await fetch(`/api/tickets/${encodeURIComponent(ticketId)}/attachments`, {
            method: "POST",
            body: form,
          });
          if (!res.ok) {
            throw new Error(`Échec de l'upload (${res.status})`);
          }
          const created: Attachment = await res.json();
          setAttachments((prev) => [created, ...prev]);
        } catch (err) {
          setError((err as Error).message);
        } finally {
          setUploading(false);
          if (fileInputRef.current) fileInputRef.current.value = "";
        }
      })();
    },
    [ticketId]
  );

  const onChooseFile = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm("Supprimer cette pièce jointe ?")) return;
    setError(null);
    try {
      const res = await fetch(`/api/attachments/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error(`Impossible de supprimer (${res.status})`);
      }
      setAttachments((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      setError((err as Error).message);
    }
  }, []);

  const emptyState = useMemo(
    () =>
      !loading && attachments.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          Aucune pièce jointe pour ce ticket.
        </Typography>
      ) : null,
    [loading, attachments.length]
  );

  return (
    <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
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
            onClick={onChooseFile}
            disabled={uploading || loading}
            size="small"
            variant="contained"
          >
            {uploading ? "Envoi..." : "Ajouter"}
          </Button>
        </Box>
      </Box>

      {error && (
        <Typography variant="body2" color="error" mb={1}>
          {error}
        </Typography>
      )}

      {loading ? (
        <Typography variant="body2">Chargement...</Typography>
      ) : (
        <>
          {emptyState}
          {attachments.length > 0 && (
            <List dense>
              {attachments.map((att) => (
                <ListItem
                  key={att.id}
                  divider
                  secondaryAction={
                    <>
                      {att.url && (
                        <IconButton
                          component="a"
                          href={att.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="ouvrir"
                          size="small"
                          sx={{ mr: 1 }}
                        >
                          <CloudUploadIcon />
                        </IconButton>
                      )}
                      <IconButton
                        edge="end"
                        aria-label="supprimer"
                        onClick={() => void handleDelete(att.id)}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </>
                  }
                >
                  <ListItemText
                    primary={att.filename}
                    secondary={att.createdAt ? new Date(att.createdAt).toLocaleString() : undefined}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </>
      )}
    </Paper>
  );
}
