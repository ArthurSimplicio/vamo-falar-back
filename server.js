import { config } from "dotenv"
config()
import http from "http"
import express from "express"
import cors from "cors"
import jwt from "jsonwebtoken"
import userRoutes from "./src/routes/userRoutes.js"
import authRoutes from "./src/routes/authRoutes.js"
import { dbConnect } from "./src/data/connectDB.js"
import { Server } from "socket.io"
import { Message } from "./src/models/Message.js"
import { Room } from "./src/models/Room.js"
import roomRoutes from "./src/routes/roomRoutes.js"
const PORT = process.env.PORT || 3000
dbConnect()
const app = express()

app.use(express.json())
app.use(cors({
     origin: ["https://vamo-falar-front.vercel.app", "http://localhost:5173"],
        credentials: true,
        methods: ["GET", "POST"]
}))
app.use('/auth', authRoutes)    
app.use('/users', userRoutes)
app.use('/room', roomRoutes)

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: ["https://vamo-falar-front.vercel.app","http://localhost:5173"],
        credentials: true,
        methods: ["GET", "POST"]
    }
})

const secret = process.env.JWT_SECRET

io.use((socket, next) =>{
    const token = socket.handshake.auth.token
    if(!token) return next(new Error("Token ausente"))
    try {
        const decoded = jwt.verify(token, secret)
        socket.user = decoded
        next()
    } catch (error) {
        next(new Error("Token invalido"))
    }
})

io.on("connection", (socket)=>{
    console.log(`Usuario conectado: ${socket.user.name}`)

    socket.on("joinRoom", async ({roomName, type = "group"}) =>{
        let room = await Room.findOne({name: roomName})
        if(!room){
            room = new Room({name: roomName, type, members: [socket.user.registration]})
            await room.save()
        }

        socket.join(roomName)
        console.log(`${socket.user.name} entrou na sala ${roomName}`)
        const history = await Message.find({room: roomName}).sort({_id: 1})
        socket.emit("roomHistory", history)
    })
   socket.on("sendMessage", async ({room, text}) =>{
     const messageData = {
        room,
        user: socket.user.name,
        text,
        time: new Date().toLocaleTimeString()
    }
    const newMessage = new Message(messageData)
    await newMessage.save()

    io.to(room).emit("newMessage", messageData)
   })

   socket.on("disconnect", ()=>{
    console.log(`Usuario saiu: ${socket.user.name}`)
   })   
})
server.listen(PORT, () => console.log("Rodando"))
export default app