import { Button, Stack, TableCell, TableRow, TextField } from "@mui/material";
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
				<TableCell>
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
				<TableCell>{category.name}</TableCell>
			)}
			<TableCell>
				{isEdit ? (
					<Stack direction="row" spacing={2}>
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
					<Stack direction="row" spacing={2}>
						<Button variant="contained" onClick={handleEdit}>
							Editer
						</Button>
						<Button variant="outlined" color="error" onClick={handleDelete}>
							Supprimer
						</Button>
					</Stack>
				)}
			</TableCell>
		</TableRow>
	);
};

export default Category;
