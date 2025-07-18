const conversationSchema = require("../models/conversationSchema");
const messageSchema = require("../models/messageSchema");
const cloudinary = require("../helpers/cloudinary");
const fs = require('fs');
const sendMessage = async (req, res)=>{
try {
  const {reciverId,contentType, content, conversationId} = req.body;  
  
  if(!reciverId || !conversationId){
    return res.status(400).send("All fields required")
  }
  const existingConversation = await conversationSchema.findOne({_id: conversationId})
  
  if(!existingConversation) return res.status(400).send("No conversation found")
    let result;
  if(req?.file?.path){
    // Upload Chat Image
    result = await cloudinary.uploader.upload(req.file.path, { folder: `vibez/chat`});
    fs.unlinkSync(req.file.path)
  }
  
  const message = new messageSchema({
      sender: req.user.id,
      reciver: reciverId,
      content: content || result?.secure_url,
      conversation: existingConversation._id,
      contentType
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

     const page = parseInt(req.query.page) || 1; // Default to page 1
     const limit = parseInt(req.query.limit) || 20; // Default 20 messages per page
     const skip = (page - 1) * limit;
    
     const messages = await messageSchema.find({conversation: conversationid})
     .limit(limit)
      .sort({createdAt: -1})
     
      // Get total count of messages for this chat
    const totalMessages = await messageSchema.countDocuments({conversation: conversationid});
        // Calculate if there are more messages to load
    const hasMore = totalMessages > (skip + limit);
     messages.reverse()
     console.log(messages);
     
     res.status(200).send({messages,
      pagination: {
        currentPage: page,
        totalMessages,
        hasMore,
        limit
      }})
    } catch (error) {
      res.status(500).send("Server error!")
    }
}

const deleteMessage = async (req, res)=>{
try {
  const { messageId } = req.params;
console.log("messageId",messageId);

  const message = await messageSchema.findById(messageId);
  if (!message) {
    return res.status(404).send("Message not found");
  }
  if (message.contentType === "image") {
    await cloudinary.uploader.destroy(`vibez/chat/${message.content.split('/').pop().split('.')[0]}`);
  }
  
  await message.deleteOne();

  // Update last message in conversation if needed
  const conversation = await conversationSchema.findById(message.conversation);
  if (conversation && conversation.lastMessage.toString() === messageId) {
    const lastMessage = await messageSchema
      .findOne({ conversation: message.conversation })
      .sort({ createdAt: -1 });

    await conversationSchema.findByIdAndUpdate(message.conversation, {
      lastMessage: lastMessage ? lastMessage._id : null,
    });
  }
  
  global.io.to(conversation._id).emit("message_deleted", messageId);
  res.status(200).send("Message deleted successfully");
} catch (error) {
  res.status(500).send("Server error");
}

}

module.exports = {sendMessage, getMessages, deleteMessage}