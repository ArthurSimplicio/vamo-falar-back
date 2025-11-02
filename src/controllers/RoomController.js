import { Room } from "../models/Room.js";

class RoomController {
    static async getUserRoom(req, res) {
        try {
            const userRegistration = req.user.registration
            const rooms = await Room.find({ members: userRegistration })
            res.status(200).json({ rooms })
        } catch (error) {
            console.error("Erro ao listar salas:", error)
            res.status(500).json({ msg: "Erro ao buscar salas" })
        }
    }
    static async createRoom(req, res) {
        try {
            const { name, members } = req.body
            const userRegistration = req.user.registration

            if (!name)
                return res.status(400).json({ msg: "Sua sala deve ter um nome" })
            if (!members || members.length === 0)
                return res.status(400).json({ msg: "Adicione um membro" })

            const allMembers = [...new Set([...members, userRegistration])]


            const room = await Room.create({ name, members: allMembers })
            res.status(201).json(room)

        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Erro ao criar sala", error });
        }
    }
}

export default RoomController