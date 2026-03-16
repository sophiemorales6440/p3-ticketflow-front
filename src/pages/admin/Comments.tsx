import { useEffect, useState } from "react";

interface CommentType {
	id: number;
	content: string;
	author_id: number;
	ticket_id: number;
}

export default function Comments() {
	const [comment, setComment] = useState<CommentType[]>([]);
	useEffect(() => {
		const afficheComments = async () => {
			const response = await fetch("http://localhost:3310/api/comments");
			const data = await response.json();
			setComment(data);
		};
		afficheComments();
	}, []);

	return (
		<div>
			<h1>Comments</h1>
			{comment.map((comment) => (
				<p key={comment.id}>
					{comment.ticket_id} {comment.author_id} {comment.content}
					<button type="button">supprimer</button>
					<button type="button">ajouter</button>
				</p>
			))}
		</div>
	);
}
