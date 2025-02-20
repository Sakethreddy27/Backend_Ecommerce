const Vendor = require('../models/Vendor');

const jwt = require('jsonwebtoken');
 const dotEnv= require('dotenv');


 dotEnv.config();



const verifyToken= async(req,res,next)=>{
    const token = req.headers.token|| req.headers.authorization?.split(' ')[1];

    if(!token){

        return res.status(401).json({error:"Token is require"});

    }
    try{
        const secretKey = process.env.JWT_SECRET;
        if (!secretKey) {
            return res.status(500).json({ error: "Secret key not found" }); // Handle the case where secret key is missing
        }
        const decoded = jwt.verify(token,secretKey)
        const vendor = await Vendor.findById(decoded.vendorId);

        if(!vendor){
            return res.status(404).json({error:"vendor  not found"})}

        req.vendorId = vendor._id
        next()
    }
    catch(error){
        console.error(error)
        return res.status(500).json({error:"Invalid Token"});
    }

}

module.exports = verifyToken