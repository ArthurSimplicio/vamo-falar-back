import mongoose, { Schema } from "mongoose";

export const Message =  mongoose.model("Message", new Schema({
    room: {type: String, required: true},
    user: {type: String, required: true},
    text: {type: String, required: true},
    time: {type: String, default: ()=> new Date().toLocaleTimeString() },
}))