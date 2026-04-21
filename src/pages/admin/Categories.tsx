import {
	Box,
	Button,
	Paper,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField,
	Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { fetchWithToken } from "../../utils/api";
import Category from "./CategoryCard";

interface CategoryType {
	id: number;
	name: string;
}
export default function Categories() {
	const [categories, setCategories] = useState<CategoryType[]>([]);
	const [isUpdate, SetIsUpdate] = useState(false);
	const [name, setName] = useState("");
	const handleAdd = async () => {
		const newData = { name };
		await fetchWithToken(`${import.meta.env.VITE_API_URL}/api/categories/`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(newData),
		});
		setName("");
		SetIsUpdate(true);
	};
	useEffect(() => {
		fetchWithToken(`${import.meta.env.VITE_API_URL}/api/categories/`)
			.then((response) => response.json())
			.then((data) => setCategories(data))
			.then(() => SetIsUpdate(false))
			.catch((error) => console.error(error));
	}, [isUpdate]);
	//ajoute un formulaire pour ajouter une catégorie
	return (
		<Box>
			<Typography variant="h4" sx={{ mt: 5 }}>
				Gestion des catégories
			</Typography>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					handleAdd();
				}}
			>
				<Stack
					direction="row"
					spacing={2}
					alignItems="center"
					sx={{ mt: 3, mb: 2 }}
				>
					<TextField
						label="Nom de la catégorie"
						value={name}
						onChange={(e) => setName(e.target.value)}
						size="small"
						sx={{ flex: 1, bgcolor: "white", borderRadius: 1 }}
					/>
					<Button
						type="submit"
						variant="contained"
						color="primary"
						size="small"
						sx={{ textTransform: "none" }}
					>
						Ajouter
					</Button>
				</Stack>
			</form>
			<Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
				{categories.length} catégorie{categories.length > 1 ? "s" : ""}
			</Typography>
			<TableContainer component={Paper} sx={{ mt: 2 }}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell
								sx={{
									width: "70%",
									fontWeight: "bold",
									bgcolor: "#e8f0fe",
									color: "text.secondary",
									textAlign: "center",
								}}
							>
								Catégories
							</TableCell>
							<TableCell
								sx={{
									fontWeight: "bold",
									bgcolor: "#e8f0fe",
									color: "text.secondary",
									textAlign: "center",
								}}
							>
								Actions
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{categories.map((category) => (
							<Category
								key={category.id}
								category={category}
								SetIsUpdate={SetIsUpdate}
							/>
						))}
						{categories.length === 0 && (
							<TableRow>
								<TableCell colSpan={2} align="center" sx={{ py: 4 }}>
									Aucune catégorie disponible.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>
		</Box>
	);
}
