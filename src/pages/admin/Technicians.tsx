import {
    Box,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";
import { Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchWithToken } from "../../utils/api";

interface UserType {
    id: number;
    firstname: string;
    lastname: string;
    role: string;
    email: string;
    password: string;
}

interface TicketType {
    id: number;
    title: string;
    status: string;
    priority: string;
    category_id: number;
    category_name: string;
    created_at: string;
    resolved_at: string | null;
}

export default function Technicians() {
    const [technicians, setTechnicians] = useState<UserType[]>([]);
    const [isUpdate, SetIsUpdate] = useState(false);
    const [search, setSearch] = useState("");
    const [selectedTechnician, setSelectedTechnician] = useState<UserType | null>(
        null,
    );
    const [tickets, setTickets] = useState<TicketType[]>([])

    useEffect(() => {
        fetchWithToken(`${import.meta.env.VITE_API_URL}/api/users/`)
            .then((response) => response.json())
            .then((data) =>
                setTechnicians(data.filter((user) => user.role === "technician")),
            )
            .catch((error) => console.error(error));
    }, [isUpdate]);

    useEffect(() => {
        if (!selectedTechnician) return;
        fetchWithToken(`${import.meta.env.VITE_API_URL}/api/users/${selectedTechnician.id}/tickets`)
            .then((response) => response.json())
            .then((data) => setTickets(data))
            .catch((error) => console.error(error));
    }, [selectedTechnician])


    const filteredTechnicians = technicians.filter(
        (user) =>
            user.firstname.toLowerCase().includes(search.toLowerCase()) ||
            user.lastname.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase()),
    );

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Gestion de mes Techniciens
            </Typography>

            <TextField
                label="Rechercher par prénom, nom ou email"
                variant="outlined"
                fullWidth
                sx={{
                    mb: 3,
                    bgcolor: "white",
                    borderRadius: 2,
                    "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "#000000", borderWidth: "1px" },
                        "&:hover fieldset": { borderColor: "#00FFD1" },
                        "&.Mui-focused fieldset": { borderColor: "#00FFD1" },
                    },
                }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: "#2f5071" }}>
                            <TableCell sx={{ fontWeight: "bold", color: "white" }}>
                                Prénom
                            </TableCell>
                            <TableCell sx={{ fontWeight: "bold", color: "white" }}>
                                Nom
                            </TableCell>
                            <TableCell sx={{ fontWeight: "bold", color: "white" }}>
                                Email
                            </TableCell>
                            <TableCell sx={{ fontWeight: "bold", color: "white" }}>
                                Role
                            </TableCell>
                            <TableCell sx={{ fontWeight: "bold", color: "white" }}>
                                Modifier
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredTechnicians.map((technician) => (
                            <TableRow key={technician.id}>
                                <TableCell>{technician.firstname}</TableCell>
                                <TableCell>{technician.lastname}</TableCell>
                                <TableCell>{technician.email}</TableCell>
                                <TableCell>{technician.role}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => setSelectedTechnician(technician)}>
                                        <Eye size={18} />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {selectedTechnician && (
                <Box sx={{ mt: 3, p: 2, bgcolor: "black", borderRadius: 2 }}>
                    <Typography variant="h6">
                        Tickets de {selectedTechnician.firstname} {selectedTechnician.lastname}
                    </Typography>
                    {tickets.map((ticket) => (
                        <Box key={ticket.id}>
                            <Typography>{ticket.title}</Typography>
                            <Typography>{ticket.status}</Typography>
                            <Typography>{ticket.priority}</Typography>
                            <Typography>{ticket.category_id}</Typography>
                            <Typography>{ticket.category_name}</Typography>
                        </Box>
                    ))}
                </Box>
            )}

        </Box>
    );
}


