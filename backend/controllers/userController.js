const bcrypt = require("bcrypt");
const User = require('../models/userModel'); 
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
        from:process.env.FROM_EMAIL,
        to:email,
        subject:"Account verification email",
        text:`Please verify your account using ${otp} OTP`
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
                    from:process.env.FROM_EMAIL,
                    to:email,
                    subject:"Account verification email",
                    text:`Please verify your account using ${otp} OTP`
                });
                
                user.verificationotp = hashedotp;
                user.otpexpire = otpExpirationTime;
                await user.save();
                
                res.json({success:false,msg:"Please verify your account, OTP send on your email",notverified:true});
            }

            const token = jwt.sign({user:user._id,email:email},process.env.JWT_SECRET,{expiresIn:"1d"});
            res.cookie("token",token,{
                httpOnly:true,
                secure:false,
                sameSite:"Lax"
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

const sendVerifyEmail = async (req, res) => {
    const {email} = req.body;

    if(!email) {
        res.json({success:false,msg:"Please provide your registered email"});
    }

    try {
        const user = await User.findOne({email});

        if(!user) {
            res.json({success:false,msg:"User not exist"});
        }

        if(user.isverify == false){
            const otp = Math.floor(999 + Math.random() * 9000);

            authEmail.sendEmail({
                from:process.env.FROM_EMAIL,
                to:email,
                subject:"Reset password verifiacation email",
                text:`Please verify your account`
            })

            res.json({success:true,otp:otp});
        } else {
            res.json({success:false,msg:"User already verified"});
        }
    } catch(error) {
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

        const token = jwt.sign({user:user._id,email:email},process.env.JWT_SECRET,{expiresIn:"1d"});

        res.cookie("token",token,{
            httpOnly:true,
            secure:false,
            sameSite:"Lax"
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

        const resetlink = "http://localhost:3000/reset-password/"+token;

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

module.exports = {register, login, alluser, logout , verifyAccount , sendResetPasswordEmail, resetPassword};