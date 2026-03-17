import { Button, Stack, TableCell, TableRow, TextField } from "@mui/material";
import { useState } from "react";

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
		const response = await fetch(
			`http://localhost:3310/api/categories/${category.id}`,
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
		const response = await fetch(
			`http://localhost:3310/api/categories/${category.id}`,
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
		<TableRow>
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
							Save
						</Button>
						<Button
							variant="outlined"
							color="error"
							onClick={() => setIsEdit(false)}
						>
							Cancel
						</Button>
					</Stack>
				) : (
					<Stack direction="row" spacing={2}>
						<Button variant="contained" onClick={handleEdit}>
							Edit
						</Button>
						<Button variant="outlined" color="error" onClick={handleDelete}>
							Delete
						</Button>
					</Stack>
				)}
			</TableCell>
		</TableRow>
	);
};

export default Category;
