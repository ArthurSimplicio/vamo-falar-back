import mongoose, { Schema } from "mongoose";

export const Room = new mongoose.model("room", new Schema({
    name: {type: String, required: true, unique: true},
    members: [{type: String, required: true}]
}, {timestamps: true}))