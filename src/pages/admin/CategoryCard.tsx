import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Stack,
	TableCell,
	TableRow,
	TextField,
} from "@mui/material";
import { useState } from "react";
import { fetchWithToken } from "../../utils/api";

interface CategoryType {
	id: number;
	name: string;
}
interface Props {
	category: CategoryType;
	SetIsUpdate: React.Dispatch<React.SetStateAction<boolean>>;
}
const Category = ({ category, SetIsUpdate }: Props) => {
	const [isEdit, setIsEdit] = useState(false);
	const [name, setName] = useState("");
	const [openConfirm, setOpenConfirm] = useState(false);
	const handleEdit = () => {
		setIsEdit(true);
	};
	const handleDelete = async () => {
		const response = await fetchWithToken(
			`${import.meta.env.VITE_API_URL}/api/categories/${category.id}`,
			{
				method: "DELETE",
				headers: {
					"content-Type": "application/json",
				},
			},
		);
		if (response.ok) {
			SetIsUpdate((prev) => !prev);
		}
	};
	const handleSave = async () => {
		const newData = { id: category.id, name: name || category.name };
		const response = await fetchWithToken(
			`${import.meta.env.VITE_API_URL}/api/categories/${category.id}`,
			{
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(newData),
			},
		);
		if (response.ok) {
			SetIsUpdate((prev) => !prev);
			setIsEdit(false);
			setName("");
		}
	};
	return (
		<TableRow sx={{ "&:hover": { bgcolor: "#f5f5f5" } }}>
			{isEdit ? (
				<TableCell sx={{ borderRight: "1px solid #c0c0c0" }}>
					<TextField
						size="small"
						variant="outlined"
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder={category.name}
					/>
				</TableCell>
			) : (
				<TableCell sx={{ borderRight: "1px solid #c0c0c0" }}>
					{category.name}
				</TableCell>
			)}
			<TableCell sx={{ textAlign: "center" }}>
				{isEdit ? (
					<Stack direction="row" spacing={2} justifyContent="center">
						<Button variant="contained" onClick={handleSave}>
							Enregistrer
						</Button>
						<Button
							variant="outlined"
							color="error"
							onClick={() => setIsEdit(false)}
						>
							Annuler
						</Button>
					</Stack>
				) : (
					<Stack direction="row" spacing={2} justifyContent="center">
						<Button
							variant="contained"
							onClick={handleEdit}
							sx={{ textTransform: "none" }}
						>
							Editer
						</Button>
						<Button
							variant="outlined"
							color="error"
							onClick={() => setOpenConfirm(true)}
							sx={{ textTransform: "none" }}
						>
							Supprimer
						</Button>
					</Stack>
				)}
			</TableCell>
			<Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
				<DialogTitle>Confirmer la suppression</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Êtes-vous sûr de vouloir supprimer cette catégorie ?
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setOpenConfirm(false)} color="primary">
						Annuler
					</Button>
					<Button
						color="error"
						variant="contained"
						onClick={() => {
							handleDelete();
							setOpenConfirm(false);
						}}
					>
						Supprimer
					</Button>
				</DialogActions>
			</Dialog>
		</TableRow>
	);
};

export default Category;
