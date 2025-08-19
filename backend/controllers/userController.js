const bcrypt = require("bcrypt");
const User = require('../models/userModel');
const Post = require("../models/postModel");
const Like = require("../models/likeModel");
const Comment = require("../models/commentModel");
const jwt = require("jsonwebtoken");
const authEmail = require("../config/emailconfig");
require("dotenv").config();

const register = async (req,res) => {
    const {name , email ,password} = req.body;

    if(!name || !email || !password){
        res.json({success:false, msg:"All fields are mendetory"});
    }

    const isUserExist = await User.findOne({email});
    if(isUserExist){
        res.json({success:false,msg:"User already exist"});
    }

    const hashpassword = await bcrypt.hash(password,10);

    const otp = Math.floor(999 + Math.random() * 9000);
    const hashedotp = await bcrypt.hash(otp.toString(),10);
    const otpExpirationTime = Date.now() + 10 * 60 * 1000;

    await authEmail.sendMail({
        from: process.env.FROM_EMAIL,
        to: email,
        subject: "Verify your account",
        text: `Hi there, \n\nThank you for signing up. Please use the following One-Time Password (OTP) to verify your account: \n\n${otp}\n\nThis OTP will expire in 10 minutes. If you did not request this, please ignore this email.`,
        html: `<div style="font-family: Arial, sans-serif; color: #333;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                        <td align="center">
                            <table width="600" cellpadding="20" cellspacing="0" border="0" style="border: 1px solid #e0e0e0; border-radius: 8px;">
                                <tr>
                                    <td>
                                        <h2 style="color: #007bff;">Account Verification</h2>
                                        <p>Hi there,</p>
                                        <p>Thank you for signing up. Please use the following One-Time Password (OTP) to verify your account:</p>
                                        <p style="font-size: 24px; font-weight: bold; color: #007bff;">${otp}</p>
                                        <p>This OTP will expire in 10 minutes. If you did not request this, please ignore this email.</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </div>`
    });

    const newUser = await User({
        name,
        email,
        password:hashpassword,
        isverify:false,
        verificationotp:hashedotp,
        otpexpire:otpExpirationTime
    });

    await newUser.save();
    
    res.status(200).json({success:true,msg:"Please verify your account",newUser:newUser});
};

const login = async (req,res) => {
    const {email,password} = req.body;

    if(!email || !password){
        res.json({success:false,msg:"All fields are mendetory"});
    }
    
    try {
        const user = await User.findOne({email});
        if(!user){
            res.json({success:false,msg:"User not exist"});
        }

        const isMatch = await bcrypt.compare(password,user.password);
        if(isMatch){
            if(!user.isverify){
                const otp = Math.floor(999 + Math.random() * 9000);
                const hashedotp = await bcrypt.hash(otp.toString(),10);
                const otpExpirationTime = Date.now() + 10 * 60 * 1000;

                await authEmail.sendMail({
                    from: process.env.FROM_EMAIL,
                    to: email,
                    subject: "Verify your account",
                    text: `Hi there, \n\nThank you for signing up. Please use the following One-Time Password (OTP) to verify your account: \n\n${otp}\n\nThis OTP will expire in 10 minutes. If you did not request this, please ignore this email.`,
                    html: `<div style="font-family: Arial, sans-serif; color: #333;">
                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td align="center">
                                        <table width="600" cellpadding="20" cellspacing="0" border="0" style="border: 1px solid #e0e0e0; border-radius: 8px;">
                                            <tr>
                                                <td>
                                                    <h2 style="color: #007bff;">Account Verification</h2>
                                                    <p>Hi there,</p>
                                                    <p>Thank you for signing up. Please use the following One-Time Password (OTP) to verify your account:</p>
                                                    <p style="font-size: 24px; font-weight: bold; color: #007bff;">${otp}</p>
                                                    <p>This OTP will expire in 10 minutes. If you did not request this, please ignore this email.</p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </div>`
                });


                user.verificationotp = hashedotp;
                user.otpexpire = otpExpirationTime;
                await user.save();
                
                res.json({success:false,msg:"Please verify your account, OTP send on your email",notverified:true});
            }

            const token = jwt.sign({user_id:user._id,email:email},process.env.JWT_SECRET);
            res.cookie("token",token,{
                httpOnly:true,
                secure:true,
                sameSite:"None",
            });

            res.json({success:true,msg:"Login successfull"});
        } else {
            res.json({success:false,msg:"Password not match"});
        }
        
    } catch (error) {
        res.json({success:false,msg:error.message})
    }
};

const logout = async (req,res) => {
    try {
        res.clearCookie('token');
        res.json({success:true,msg:"Logout Successfully"});
    } catch(error) {
        res.json({success:false,msg:error.message});
    }
}

const alluser = async (req,res) => {
    const users = await User.find();
    res.status(200).json({msg:"ALL users are here bro",users:users});
};

const getUser = async (req,res) => {
    const { id } = req.body;
    const user_id = id ? id : req.user_id;

    if(!user_id) {
        res.json({success:false,msg:"Invalid User"});
    }

    try {
        const user = await User.findOne({_id:user_id}).select("name email bio profileimage followings followers");

        if(!user){
            res.json({success:false,msg:"User not found"});
        }

        res.json({success:true,user:user});
    } catch (error) {
        res.json({success:false,msg:error.message});
    }
}

const verifyAccount = async (req, res) => {
    const {email , otp } = req.body;

    if(!email){
        res.json({success:false,msg:"Email not provided"});
    }
    if(!otp) {
        res.json({success:false,msg:"Please enter otp"});
    }

    try {
        const user = await User.findOne({email});

        if(!user) {
            res.json({success:false,msg:"User not exist"});
        }

        const comparedotp = await bcrypt.compare(otp,user.verificationotp);
        
        if(!comparedotp){
            res.json({success:false,msg:"Invalid OTP"});
        }

        if(user.otpexpire < Date.now()){
            res.json({success:false,msg:"OTP expired"});
        }

        const token = jwt.sign({user_id:user._id,email:email},process.env.JWT_SECRET);

        res.cookie("token",token,{
            httpOnly:true,
            secure:true,
            sameSite:"None",
            maxAge: 24 * 60 * 60 * 1000
        });

        user.isverify = true;
        user.otpexpire = 0;
        user.verificationotp = '';

        await user.save();

        res.json({success:true,msg:"Account verified successfully"});
    } catch (error) {
        res.json({success:false,msg:error.message});
    }
};

const sendResetPasswordEmail = async (req, res) => {
    const {email} = req.body;

    if(!email){
        res.json({success:false,msg:"Please provide email"});
    }

    try {
        const user = await User.findOne({email});

        if(!user){
            res.json({success:false,msg:"User not exist"});
        }

        const token = await jwt.sign({user_id:user._id,email:user.email},process.env.JWT_SECRET,{expiresIn:"10m"});

        user.resetpasswordtoken = token;
        await user.save();

        const frontend_url = process.env.FRONTEND_URL;
        const resetlink = frontend_url+"/reset-password/"+token;

        await authEmail.sendMail({
            from: process.env.FROM_EMAIL,
            to: email,
            subject: "Reset password link email",
            html: `
                <div>
                <p>Hello ${user.name},</p>
                <p>Please reset your password by clicking the link below:</p>
                <a href="${resetlink}" target="_blank" rel="noopener noreferrer">
                    Reset Password
                </a>
                <p>If you didn't request this, you can safely ignore this email.</p>
                </div>
            `
        });
        
        res.json({success:true,msg:"Please check reset link from your email"});
    } catch (error) {
        res.json({success:false,msg:error.message});
    }
}

const resetPassword = async (req, res) => {
    const {token , password} = req.body;

    if(!password){
        res.json({success:false,msg:"Please provide new password"});
    }

    if(!token){
       res.json({success:false,msg:"Invalid token"}); 
    }
    
    try {
        const payload = await jwt.verify(token,process.env.JWT_SECRET);

        if(payload) {
            const email = payload.email;
            const user = await User.findOne({email});

            const hashpassword = await bcrypt.hash(password,10);

            user.password = hashpassword;
            user.resetpasswordtoken = "";

            await user.save();

            res.json({success:true,msg:"Password reset successfully"});
        } else {
            res.json({success:false,msg:"Token expired"});
        }
    } catch (error) {
        res.json({success:false,msg:error.message});
    }
}

const updateuser = async (req,res) => {
    const {name, bio, email} = req.body;

    if(!name) {
        res.json({success:false,msg:"Name is required"});
    }

    try {
        const user = await User.findOne({email}).select("bio name profileimage");

        if(!user){
            res.json({success:false,msg:"User not found"});
        }

        user.bio = bio;
        user.name = name;
        if(req.file){
            user.profileimage = "uploads/"+req.file.filename;
        }
        await user.save();

        res.json({success:true,user:user,msg:"Profile update successfully"});
    } catch (error) {
        res.json({success:false,msg:error.message});
    }    
}

const getUserConnections = async (req,res) => {
    const user_id = req.user_id;
    const {state} = req.body;
    try {
        let users;
        switch (state) {
            case "all":
                users = await User.find({ _id: { $ne: user_id } }).select("name email bio profileimage followings followers");
                break;
            case "following":
                users = await User.find({ followers: user_id }).select("name email bio profileimage followings followers");
                break;
            case "follower":
                users = await User.find({ followings: user_id }).select("name email bio profileimage followings followers");
                break;
            default:
                return res.status(400).json({ success: false, msg: "Invalid state parameter" });
        }

        if(!users){
            res.json({success:false,msg:"User Not Found"});
        }

        res.json({success:true,users:users,user_id:user_id});
    } catch (error) {
        res.json({success:false,msg:error.message});
    }
}

const followUser = async (req, res) => {
    const current_user_id = req.user_id;
    const { user_id } = req.body;

    if (!current_user_id || !user_id ) {
        return res.json({ success: false, msg: "Invalid User" });
    }

    try {
        const targetUser = await User.findById(user_id);
        const currentUser = await User.findById(current_user_id);

        if (!targetUser || !currentUser) {
            return res.json({ success: false, msg: "User not found" });
        }

        const isFollowing = targetUser.followers.includes(current_user_id);

        if (isFollowing) {
            await User.findByIdAndUpdate(user_id, { $pull: { followers: current_user_id } });
            await User.findByIdAndUpdate(current_user_id, { $pull: { followings: user_id } });

            return res.json({
                success: true,
                msg: `You unfollowed ${targetUser.name}`,
                user_id: user_id,
            });
        } else {
            await User.findByIdAndUpdate(user_id, { $addToSet: { followers: current_user_id } });
            await User.findByIdAndUpdate(current_user_id, { $addToSet: { followings: user_id } });

            return res.json({
                success: true,
                msg: `You are now following ${targetUser.name}`,
                user_id: user_id,
            });
        }
    } catch (error) {
        return res.json({ success: false, msg: error.message });
    }
};

const deleteUser = async (req, res) => {
    const user_id = req.user_id;

    if (!user_id) {
        return res.json({ success: false, msg: "Invalid User" });
    }

    try {
        await User.updateMany(
            { followers: user_id },
            { $pull: { followers: user_id } }
        );

        await User.updateMany(
            { followings: user_id },
            { $pull: { followings: user_id } }
        );

        await Post.deleteMany({ user_id });
        await Like.deleteMany({ user_id });
        await Comment.deleteMany({ user_id });
        await User.deleteOne({ _id: user_id });

        res.clearCookie('token');

        return res.json({ success: true, msg: "User deleted successfully" });

    } catch (error) {
        return res.json({ success: false, msg: error.message });
    }
};

const authUser = async (req,res) => {
    const email = req.email;

    try {
        const user = await User.findOne({email}).select("profileimage _id");

        if(!user){
            res.json({success:false,msg:"User not exist"});
        }

        res.json({success:true,user:user});
    } catch (error) {
        res.json({success:false,msg:error.message});
    }
}

module.exports = {register, login, alluser, logout , verifyAccount , sendResetPasswordEmail, resetPassword , updateuser , getUser , getUserConnections, followUser , deleteUser ,authUser};
