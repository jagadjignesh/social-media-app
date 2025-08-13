const jwt = require("jsonwebtoken");

const userAuth = async (req,res,next) => {
    const {token} = req.cookies;

    if(!token){
        return res.json({success:false,msg:"Unauthorized , Please login in again"});
    }

    try {
        const decoded = await jwt.verify(token,process.env.JWT_SECRET);
        req.email = decoded.email;
        req.user_id = decoded.user_id;
        next();
    } catch (error) {
        return res.json({success:false,msg:error.massage});
    }
}

module.exports = userAuth;