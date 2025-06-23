const { emailValidator } = require("../helpers/validators");
const conversationSchema = require("../models/conversationSchema");
const userSchema = require("../models/userSchema");

const createConversation = async (req, res)=>{
    try {
        const {participentEmail} = req.body;

        if(!participentEmail){
            return res.status(400).send({message: "Participent email is required!"})
        }
        if (emailValidator(participentEmail)) return res.status(400).send({message: "Email is not valid"});
        if(participentEmail === req.user.email){            
           return res.status(400).send({message: "Try with another email"})
        }
        const participentData = await userSchema.findOne({email: participentEmail})

        if(!participentData){
            return res.status(400).send({message: "No user found!"})
        }
        const existingParticipent = await conversationSchema.findOne({
            $or:[{creator: req.user.id, participent: participentData._id}, {participent: req.user.id, creator: participentData._id}]
        })
        
        if(existingParticipent) return res.status(400).send({message: "Already exist!!!"})
        
        const conversation = new conversationSchema({
            creator: req.user.id,
            participent: participentData._id,
        })
        await conversation.save()
        
        const populatedConversation = await conversation.populate([
                                            { path: 'creator', select: 'fullName avatar email' },
                                            { path: 'participent', select: 'fullName avatar email' },
                                            { path: 'lastMessage' }
                                            ]);
        
        res.status(200).send(populatedConversation)
    } catch (message) {
        res.status(500).send({message: "Server message!"})
    }

}

const conversationList = async (req, res)=>{       
    try {
        const conversation = await conversationSchema.find({
            $or: [{creator: req.user.id}, {participent: req.user.id}]
        }).populate("creator", "fullName avatar email").populate("participent", "fullName avatar email").populate("lastMessage").sort({ 'updatedAt': -1 })

        if(!conversation){
          return res.status(400).send({message: "No conversation found!"})
        }
       
        res.status(200).send(conversation)
    } catch (message) {
        res.status(500).send({message: "Server message!!!"}) 
    }
}

module.exports = {createConversation, conversationList}