const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    reciver: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    contentType:{
        type: String,
        default: "text",
        enum: ["text", "image", "voice"]
    },
    content: {
        type: String,
    },
    conversation: {
        type: Schema.Types.ObjectId,
        ref: "conversation"
    }
},{timestamps: true})


module.exports = mongoose.model("message", messageSchema)