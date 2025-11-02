import mongoose, { Schema } from "mongoose"

export const User = mongoose.model("User", new Schema({
    name: { type: String, required: true },
    registration: { type: String, required: true, unique: true },
    password: {type: String, required: true},
    role: {type: String, enum: ["user", "admin"], default: "user"}
}, 
{timestamps: true}
))
