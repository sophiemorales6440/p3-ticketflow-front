export const translateStatus = (status: string) => {
	const translations: Record<string, string> = {
		open: "Ouvert",
		in_progress: "En cours",
		resolved: "Résolu",
		closed: "Fermé",
	};
	return translations[status] || status;
};

export const translatePriority = (priority: string) => {
	const translations: Record<string, string> = {
		low: "Basse",
		medium: "Moyenne",
		high: "Haute",
		critical: "Critique",
	};
	return translations[priority] || priority;
};

export const formatDate = (date: string) => {
	return new Date(date).toLocaleDateString("fr-FR");
};
