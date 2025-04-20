const conversationSchema = require("../models/conversationSchema");
const userSchema = require("../models/userSchema");

const createConversation = async (req, res)=>{
    try {
        const {participentEmail} = req.body;

        if(!participentEmail){
            return res.status(400).send({error: "Participent email is required!"})
        }
        if(participentEmail === req.user.email){
           return res.status(400).send({error: "Try with another email"})
        }
        const participentData = await userSchema.findOne({email: participentEmail})

        if(!participentData){
            return res.status(400).send({error: "No user found!"})
        }

        const conversation = new conversationSchema({
            creator: req.user.id,
            participent: participentData._id,
        })
        conversation.save()

        res.status(200).send(conversation)
    } catch (error) {
        res.status(500).send("Server error!")
    }

}

const conversationList = async (req, res)=>{
    try {
        const conversation = await conversationSchema.find({
            $or: [{creator: req.user.id}, {participent: req.user.id}]
        }).populate("creator", "fullName avatar email").populate("participent", "fullName avatar email").populate("lastMessage")

        if(!conversation){
          return res.status(400).send("No conversation found!")
        }
       
        res.status(200).send(conversation)
    } catch (error) {
        res.status(500).send("Server error!") 
    }
}

module.exports = {createConversation, conversationList}