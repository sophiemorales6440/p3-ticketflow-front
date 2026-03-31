// ─── Types ────────────────────────────────────────────────────────────────────

export interface TicketType {
	id: number;
	title: string;
	description: string;
	status: string;
	priority: string;
	category_id: number;
	category_name: string;
	created_at: string;
	resolved_at: string | null;
	client_id: number;
	technician_id: number;
}

// ─── Constantes ───────────────────────────────────────────────────────────────

export const PRIORITY_COLORS: Record<string, string> = {
	low: "#22c55e",
	medium: "#f59e0b",
	high: "#ef4444",
	critical: "#7c3aed",
};

export const PRIORITY_LABELS: Record<string, string> = {
	low: "Basse",
	medium: "Moyenne",
	high: "Élevée",
	critical: "Critique",
};

export const STATUS_LABELS: Record<string, string> = {
	open: "En attente",
	in_progress: "En cours",
	resolved: "Résolu",
	closed: "Fermé",
};

export const STATUS_COLORS: Record<
	string,
	"default" | "info" | "warning" | "success"
> = {
	open: "warning",
	in_progress: "info",
	resolved: "success",
	closed: "default",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

export const timeAgo = (dateStr: string) => {
	const diff = Date.now() - new Date(dateStr).getTime();
	const days = Math.floor(diff / 86400000);
	const hours = Math.floor(diff / 3600000);
	if (days > 0) return `il y a ${days}j`;
	if (hours > 0) return `il y a ${hours}h`;
	return "à l'instant";
};
