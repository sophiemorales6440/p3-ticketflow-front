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
    const handleEdit = () => {        setIsEdit(true);
    };
    const handleDelete = async () => {
        const response = await fetch(`http://localhost:3310/api/categories/${category.id}`, {
            method: "DELETE",
            headers: {
                "content-Type": "application/json",
            },
        });
        if (response.ok) {        SetIsUpdate((prev) => !prev);
    }};
    const handleSave = async () => {
        const newData = {            id: category.id,
            name: name || category.name,
        };
        const response = await fetch(`http://localhost:3310/api/categories/${category.id}`, {
            method: "PUT",
            headers: {                "Content-Type": "application/json",
            },
            body: JSON.stringify(newData),
        });
        if (response.ok) {           SetIsUpdate((prev) => !prev);
            setIsEdit(false);
            setName("");
        }   };  
    return (
        <div>
            {isEdit ? (               <div>                  <input
                    type="text"
                    placeholder={category.name}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <button type="button" onClick={handleSave}>Save</button>
                </div>
            ) : (
                <div>
                    <h2>{category.name}</h2>
                    <button type="button" onClick={handleEdit}>Edit</button>
                    <button type="button" onClick={handleDelete}>Delete</button>
                </div>
            )}
        </div>
    );
}

export default Category;