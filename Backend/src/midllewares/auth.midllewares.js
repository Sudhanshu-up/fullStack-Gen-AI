import jwt from "jsonwebtoken"
import {TokenBlackList} from "../model/blacklist.model.js"

const authUser = async(req,res,next)=>{

    // Pehle Authorization: Bearer <token> header check karo — ye hi
    // production (Vercel + Render, cross-site) me reliably kaam karta hai.
    // Cookie sirf local dev fallback ke liye hai; use nahi karte agar
    // header already mil gaya, kyunki ek stale/blocked cross-site cookie
    // otherwise ek valid header token ko shadow kar sakti hai.
    let token = null

    const authHeader = req.headers.authorization || ""
    if (authHeader.startsWith("Bearer ")) {
        token = authHeader.slice(7)
    }

    if (!token) {
        token = req.cookies?.token
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
