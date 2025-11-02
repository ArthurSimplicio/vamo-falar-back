import { config } from "dotenv";
import mongoose from "mongoose";
config()

const mongoURI = process.env.NODE_ENV === 'test'
? process.env.MONGO_URI_TEST 
: process.env.MONGO_URI 
export const dbConnect = async () => mongoose.connect(mongoURI)
.then(() => console.log("Conectado ao MongoDB"))
.catch(() => console.log("Erro ao conectar"))
