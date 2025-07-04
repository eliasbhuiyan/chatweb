const conversationSchema = require("../models/conversationSchema");
const messageSchema = require("../models/messageSchema");
const cloudinary = require("../helpers/cloudinary");
const fs = require('fs');
const sendMessage = async (req, res)=>{
// try {
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
      content: content || result?.url,
      conversation: existingConversation._id,
      contentType
  })

    message.save()

    await conversationSchema.findByIdAndUpdate(existingConversation._id, {lastMessage: message})
    
    global.io.to(conversationId).emit("new_message", message)

    res.status(200).send(message)
// } catch (error) {
//   res.status(500).send("Server error!")
// }
}

const getMessages = async (req, res)=>{
    // try {
     const {conversationid} = req.params;

     const page = parseInt(req.query.page) || 1; // Default to page 1
     const limit = parseInt(req.query.limit) || 10; // Default 20 messages per page
     console.log(limit);
     const skip = (page - 1) * limit;
    
     const messages = await messageSchema.find({conversation: conversationid})
      .sort({createdAt: -1})
      .limit(limit)
     
      // Get total count of messages for this chat
    const totalMessages = await messageSchema.countDocuments({conversation: conversationid});
        // Calculate if there are more messages to load
    const hasMore = totalMessages > (skip + limit);
     const reversedMessages = messages.reverse();
    //  console.log(reversedMessages);
     
     res.status(200).send({messages,
      pagination: {
        currentPage: page,
        totalMessages,
        hasMore,
        limit
      }})
    // } catch (error) {
    //   res.status(500).send("Server error!")
    // }
}

module.exports = {sendMessage, getMessages}