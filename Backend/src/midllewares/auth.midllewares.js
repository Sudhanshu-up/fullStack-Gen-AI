import jwt from "jsonwebtoken"
import {TokenBlackList} from "../model/blacklist.model.js"

const authUser = async(req,res,next)=>{

    const token  = req.cookies.token

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