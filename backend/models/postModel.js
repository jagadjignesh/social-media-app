const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
    postimage : {
        type : String,
        required : true,
        trim : true,
    },
    description : {
        type : String,
        trim : true
    },
    user_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    }
},{
    timestamps: { createdAt: true, updatedAt: false },
  })

const Post = mongoose.model('post',postSchema);

module.exports = Post;