const Post = require("../models/postModel");
const User = require('../models/userModel');
const Like = require("../models/likeModel");
const Comment = require("../models/commentModel");

const createPost = async (req,res) => {
    if(!req.file){
        res.json({success:false,msg:"Please select post image"});
    }
    const postimage = "uploads/"+req.file.filename;
    const { description } = req.body;
    const user_id = req.user_id;

    try {
        const post = new Post({
            postimage,
            description,
            user_id
        });

        await post.save();

        res.json({success:true,msg:"Post Created Successfully"});
    } catch(error) {
        res.json({success:false,msg:error.message});
    }
}

const getUserPosts = async (req, res) => {
    const { id } = req.body;
    const targetUserId = id ? id : req.user_id;
    const currentUserId = req.user_id;

    if (!targetUserId) {
        return res.json({ success: false, msg: "Invalid User" });
    }

    try {
        const posts = await Post.find({ user_id: targetUserId })
            .populate('user_id', 'name profileimage')
            .sort({ createdAt: -1 });

        if (!posts || posts.length === 0) {
            return res.json({ success: false, msg: "Posts not found", notHavePosts: true });
        }

        const postsWithLikeInfo = await Promise.all(
            posts.map(async (post) => {
                const [likesCount, likedByUser] = await Promise.all([
                    Like.countDocuments({ post_id: post._id }),
                    Like.exists({ post_id: post._id, user_id:currentUserId })
                ]);

                const commentCount = await Comment.countDocuments({ post_id:post._id });

                return {
                    ...post.toObject(),
                    likes: likesCount,
                    isLiked: !!likedByUser,
                    commentCount: commentCount
                };
            })
        );

        res.json({ success: true, posts: postsWithLikeInfo });

    } catch (error) {
        res.json({ success: false, msg: error.message });
    }
};

const userFeed = async (req, res) => {
    const currentUserId = req.user_id;

    try {
        const currentUser = await User.findById(currentUserId).select('followings');

        if (!currentUser) {
            throw new Error("User not found");
        }

        const idsToFetchFrom = [...currentUser.followings, currentUserId];

        const posts = await Post.find({
            user_id: { $in: idsToFetchFrom }
        })
            .populate('user_id', 'name profileimage')
            .sort({ createdAt: -1 });

        const postsWithLikeInfo = await Promise.all(
            posts.map(async (post) => {
                const [likesCount, likedByUser] = await Promise.all([
                    Like.countDocuments({ post_id: post._id }),
                    Like.exists({ post_id: post._id, user_id: currentUserId })
                ]);

                const commentCount = await Comment.countDocuments({ post_id:post._id });

                return {
                    ...post.toObject(),
                    likes: likesCount,
                    isLiked: !!likedByUser,
                    commentCount: commentCount
                };
            })
        );

        res.json({ success: true, posts: postsWithLikeInfo });
    } catch (error) {
        console.error(error);
        res.json({ success: false, msg: error.message });
    }
};

const likeDislike = async (req, res) => {
    const user_id = req.user_id;
    const { post_id } = req.body;

    if (!post_id || !user_id) {
        return res.status(400).json({ success: false, msg: "Post ID and User ID are required" });
    }

    try {
        const existingLike = await Like.findOne({ post_id, user_id });

        if (existingLike) {
            await Like.deleteOne({ _id: existingLike._id });
            return res.json({ success: true, liked: false });
        } else {
            await Like.create({ post_id, user_id });
            return res.json({ success: true, liked: true });
        }
    } catch (error) {
        return res.status(500).json({ success: false, msg: error.message });
    }
};

const addPostComment = async (req, res) => {
    const { comment, post_id } = req.body;
    const user_id = req.user_id;
    
    if (!comment || comment.trim() === "") {
        res.json({ success: false, msg: "Comment cannot be empty." });
    }
    
    try {
        const newComment = new Comment({
            user_id: user_id,
            post_id: post_id,
            text: comment
        });

        const savedComment = await newComment.save();

        await savedComment.populate("user_id", "name profileimage");

        res.json({
            success: true,
            comment: {
                text: savedComment.text,
                user: savedComment.user_id,
                createdAt: savedComment.createdAt
            }
        });
    } catch (error) {
        res.json({ success: false, msg: error.message });
    }
};

const getPostComments = async (req, res) => {
    const { post_id } = req.body;

    if (!post_id) {
        return res.json({ success: false, msg: "Post ID is required" });
    }

    try {
        const comments = await Comment.find({ post_id })
            .populate("user_id", "name profileimage")
            .sort({ createdAt: 1 });

        const formattedComments = comments.map(comment => ({
            text: comment.text,
            user: comment.user_id,
            createdAt: comment.createdAt
        }));

        res.json({ success: true, comments: formattedComments });
    } catch (error) {
        res.json({ success: false, msg: "Failed to fetch comments" });
    }
};


module.exports = {createPost, getUserPosts, userFeed, likeDislike, addPostComment, getPostComments};