
const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({

    comment: {
        type: String, 
        required: true
    },
    commentedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    blogId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "blog",
        required: true
    }
}, { timestamps: true });    

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;

  
    