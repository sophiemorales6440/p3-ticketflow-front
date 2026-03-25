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
		await fetchWithToken("http://localhost:3310/api/categories/", {
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
		fetchWithToken("http://localhost:3310/api/categories/")
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
					justifyContent="space-between"
					marginY={2}
					sx={{ mt: 5 }}
				>
					<TextField
						label="Nom de la catégorie"
						value={name}
						onChange={(e) => setName(e.target.value)}
						sx={{ mt: 2, width: "70%" }}
					/>
					<Button type="submit" variant="contained" sx={{ width: "30%" }}>
						Ajouter
					</Button>
				</Stack>
			</form>

			<TableContainer component={Paper} sx={{ mt: 2 }}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell
								sx={{
									width: "70%",
									fontWeight: "bold",
									bgcolor: "primary.main",
									color: "white",
									textAlign: "center",
								}}
							>
								Catégories
							</TableCell>
							<TableCell
								sx={{
									fontWeight: "bold",
									bgcolor: "primary.main",
									color: "white",
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
					</TableBody>
				</Table>
			</TableContainer>
		</Box>
	);
}
