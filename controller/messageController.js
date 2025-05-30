const conversationSchema = require("../models/conversationSchema");
const messageSchema = require("../models/messageSchema");

const sendMessage = async (req, res)=>{
try {
    const {reciverId, content, conversationId} = req.body;
    
    if(!reciverId || !content || !conversationId){
      return res.status(400).send("All fields required")
    }
    const existingConversation = await conversationSchema.findOne({_id: conversationId})

    if(!existingConversation) return res.status(400).send("No conversation found")

    const message = new messageSchema({
        sender: req.user.id,
        reciver: reciverId,
        content,
        conversation: existingConversation._id
    })

    message.save()

    await conversationSchema.findByIdAndUpdate(existingConversation._id, {lastMessage: message})
    
    global.io.to(conversationId).emit("new_message", message)

    res.status(200).send(message)
} catch (error) {
  res.status(500).send("Server error!")
}
}

const getMessages = async (req, res)=>{
    try {
     const {conversationid} = req.params;
    
     const messages = await messageSchema.find({conversation: conversationid})
     res.status(200).send(messages)
    } catch (error) {
      res.status(500).send("Server error!")
    }
}

module.exports = {sendMessage, getMessages}