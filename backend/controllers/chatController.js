const User = require("../models/userModel");
const Conversation = require("../models/conversations");
const Messages = require("../models/messageModel");

const getchatUsers = async (req,res) => {
    const currentUser = req.user_id;

    try {
        const users = await User.find({ followings : currentUser , followers : currentUser }).select("name profileimage image");

        if(!users){
            res.json({success:false,msg:"Users not found"});
        }

        const conversation = await Conversation.find({ participants : { $in : [ currentUser ]}});

        if(!conversation){
            res.json({success:false,msg:"Conversation not found"});
        }
        const updatedConversation = await Promise.all(
            conversation.map(async (chat, index) => {
                const targetUser_id = chat.participants.find(id => !id.equals(currentUser));
                let targetUser = await User.findById(targetUser_id).select('name profileimage');

                if(!targetUser){
                    targetUser = {
                        _id : targetUser_id,
                        name : "Deleted User"
                    }
                }

                return {
                ...chat.toObject(),
                user: targetUser
                };
            })
        );

        res.json({success:true,conversation:updatedConversation});
    } catch (error) {
        res.json({success:false,msg:error.message});
    }
}

const getChatMessages = async (req,res) => {
    const receiver = req.body.user_id;
    const sender = req.user_id;
    let isUserDeleted = false;

    try {
        const conversation = await Conversation.findOne({ $or : [
            { participants : [ sender , receiver] },
            { participants : [ receiver , sender ] }
        ]});

        if(!conversation){
            res.json({success:false,msg:"Chat not found"});
        }

        const messages = await Messages.find({conversationId:conversation._id});

        const user = await User.findById(receiver);

        if(!user){
            isUserDeleted = true;
        }
        res.json({success:true,messages:messages,isUserDeleted});
    } catch (error) {
        res.json({success:false,msg:error.message});
    }
}

module.exports = { getchatUsers, getChatMessages};