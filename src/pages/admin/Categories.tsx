import { useEffect, useState } from "react";
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
		await fetch("http://localhost:3310/api/categories/", {
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
		fetch("http://localhost:3310/api/categories/")
			.then((response) => response.json())
			.then((data) => setCategories(data))
			.then(() => SetIsUpdate(false))
			.catch((error) => console.error(error));
	}, [isUpdate]);
	//ajoute un formulaire pour ajouter une catégorie
	return (
		<div>
			<h1>Gestion des catégories</h1>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					handleAdd();
				}}
			>
				<input
					type="text"
					placeholder="Nom de la catégorie"
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>
				<button type="submit">Ajouter</button>
			</form>
			{categories.map((category) => (
				<Category
					key={category.id}
					category={category}
					SetIsUpdate={SetIsUpdate}
				/>
			))}
		</div>
	);
}
