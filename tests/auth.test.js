import request from "supertest"
import app from "../server.js"
import mongoose from "mongoose"
import { config } from "dotenv"
config()

beforeAll(async ()=>{
    const mongoURI = process.env.MONGO_URI_TEST ||
    "mongodb+srv://arthursimp20_db_user:tests@tests.djnoyje.mongodb.net/?appName=Tests"

    try {
        const users = await mongoose.connect(mongoURI)
        console.log("Conectado ao MongoDB");
    } catch (error) {
        console.log("Erro ao conectar", error);
    }
})
beforeEach(async () => {
  // Aguarda conexão antes de limpar
  if (mongoose.connection.readyState !== 1) {
    await new Promise((resolve) => mongoose.connection.once("connected", resolve))
  }

  const { db } = mongoose.connection
  if (db) await db.dropDatabase()
})
afterAll(async () => {
  await mongoose.connection.close()
  await new Promise(resolve => setTimeout(resolve, 1000))
})

describe("Auth routes", () => {
    it("Should register a new user", async () => {
        const res = await request(app)
            .post("/auth/register")
            .send({
                name: "Arthur test",
                email: "arthurtest@gmail.com",
                password: "1234567"
            })
        expect(res.statusCode).toBe(201)
        expect(res.body).toHaveProperty("token")
    })

    it("should login with correct credentials", async () => {
        await request(app)
            .post("/auth/register")
            .send({
                name: "Arthur login",
                email: "logintest@gmail.com",
                password: "1234567"
            })

        const res = await request(app)
            .post("/auth/login")
            .send({
                email: "logintest@gmail.com",
                password: "1234567"
            })
        expect(res.statusCode).toBe(200)
        expect(res.body).toHaveProperty("token")

        global.token = res.body.token
    })

    it("should access protected route with valid token", async () => {
        const registerRes = await request(app)
            .post("/auth/register")
            .send({
                name: "Arthur Protected",
                email: "protected@test.com",
                password: "123456"
            })
        const token = registerRes.body.token

        const res = await request(app)
            .get("/users")
            .set("Authorization", `Bearer ${token}`)

        expect(res.statusCode).toBe(200)
        expect(res.body)
    })

    it("Should deny access without token", async () => {
        const res = await request(app).get("/users")

        expect(res.statusCode).toBe(401) 
        expect(res.body).toHaveProperty("msg", "Token not found!")
    })
})

describe("Role based access", ()=>{
    it("Should allow admin to access admin route", async ()=>{
        const registerRes = await request(app)
        .post("/auth/register")
        .send({
            name: "Admin",
            email: "admin@gmail.com",
            password: "1234567",
            role: "admin"
        })
        const token = registerRes.body.token

        const res = await request(app)
        .get('/users/admin/users')
        .set("Authorization", `Bearer ${token}`)

        expect(res.statusCode).toBe(200)
        expect(res.body).toBeInstanceOf(Array)
    })

    it("Should forbid regular user from admin route", async ()=>{
        const registerRes = await request(app)
        .post("/auth/register").send({
            name: "User",
            email:"user@gmail.com",
            password: "1234567"
        })
        const token = registerRes.body.token

        const res = await request(app)
        .get("/users/admin/users")
        .set("Authorization", `Bearer ${token}`)

        expect(res.statusCode).toBe(403)
        expect(res.body).toHaveProperty("msg", "Access denied: you're not a admin")
    })
})