import jwt from "jsonwebtoken"
import {TokenBlackList} from "../model/blacklist.model.js"

const authUser = async(req,res,next)=>{

    // Pehle cookie check karo (same-site / local dev ke liye),
    // warna Authorization: Bearer <token> header check karo
    // (cross-site deployments jaise Vercel + Render ke liye, jahan
    // third-party cookies browser block kar deta hai).
    let token = req.cookies?.token

    if (!token) {
        const authHeader = req.headers.authorization || ""
        if (authHeader.startsWith("Bearer ")) {
            token = authHeader.slice(7)
        }
    }

    if(!token){
        return res
        .status(401)
        .json({
            message:"Token not provided"
        })
    }
    const isTokenBlacklisted = await TokenBlackList.findOne({token})

    if(isTokenBlacklisted){
        return res.status(401)
        .json({
            message:"Token is invaild."
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        req.user = decoded
        next()
    
    } catch (error) {
        return res
        .status(401)
        .json({
            message:"invalid token."
        })
        
    }
}

export {authUser}
