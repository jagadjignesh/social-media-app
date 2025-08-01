const jwt = require("jsonwebtoken");

const userAuth = async (req,res,next) => {
    const {token} = req.cookies;

    if(!token){
        return res.json({sucess:false,msg:"Unauthorized , Please login in again"});
    }

    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        res.json({success:true,data:'decoded'});
        next();
    } catch (error) {
        return res.json({sucess:false,errorMsg:error.massage});
    }
}

module.exports = userAuth;