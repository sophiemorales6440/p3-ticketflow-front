
import { useEffect, useState } from "react";
import Category from "./CategoryCard";

interface CategoryType {
    id: number;
    name: string;
}   
export default function Categories() {
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [isUpdate, SetIsUpdate] = useState(false);   
    useEffect(() => {
        fetch("http://localhost:3310/api/categories/")
            .then((response) => response.json())
            .then((data) => setCategories(data))
            .then(() => SetIsUpdate(false))
            .catch((error) => console.error(error));
    }, [isUpdate]);
    return (
        <div>
            <h1>Gestion des catégories</h1>
            {categories.map((category) => (  
                <Category key={category.id} category={category} SetIsUpdate={SetIsUpdate} />
            ))}
        </div>
    );
}


