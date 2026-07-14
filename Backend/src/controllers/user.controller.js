import { UserModel } from "../model/user.model.js";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import { TokenBlackList } from "../model/blacklist.model.js";
import { authUser } from "../midllewares/auth.midllewares.js";


const userRegister = async (req, res) => {
  const { username, email, password } = req.body

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({
        success: false,
        message: "All field are required"
      })
  }

  const isUserAlreadyExists = await UserModel.findOne({
    $or: [{ email }, { username }]
  })

  if (isUserAlreadyExists) {
    return res
      .status(400)
      .json({
        message: "Account already was created with these field  !!!(username,email)"
      })
  }

  const hash = await bcrypt.hash(password, 10)

  // avatar optional hai — Cloudinary URL middleware se aata hai (req.file.cloudinaryUrl)
  const avatarPath = req.file?.cloudinaryUrl || null

  const user = await UserModel.create({
    username,
    email,
    password: hash,
    avatar: avatarPath
  })

  const token = jwt.sign(
    {
      _id: user._id,
      username: user.username
    }, process.env.JWT_SECRET_KEY,
    { expiresIn: "1d" }
  )

  res.cookie("token", token, {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
});

  res.status(201)
    .json({
      message: "User registerd Successfully",
      token, // cross-site (Vercel + Render) ke liye — frontend ise Authorization header me bhejega
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar
      }
    })

};


const loginUser = async (req, res) => {
  const { email, password } = req.body
  const user = await UserModel.findOne({ email })

  if (!user) {
    return res
      .status(400)
      .json({
        message: "Invaild email and password !does not exsits User"
      })
  }
  const isPasswordCorrect = await bcrypt.compare(password, user.password)

  if (!isPasswordCorrect) {
    return res
      .status(400)
      .json({
        message: "Password in not correct!"
      })
  }

  const token = jwt.sign(
    {
      _id: user._id,
      username: user.username
    }, process.env.JWT_SECRET_KEY,
    {
      expiresIn: "10d"
    }
  )

 res.cookie("token", token, {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
});
  res.status(200)
    .json({
      message: "user loggedIn successfully",
      token, // cross-site (Vercel + Render) ke liye — frontend ise Authorization header me bhejega
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar
      }
    })
}


const logOutUser = async (req, res) => {
  let token = req.cookies?.token
  if (!token) {
    const authHeader = req.headers.authorization || ""
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.slice(7)
    }
  }

  if (token) {
    await TokenBlackList.create({ token })
  }

  res.clearCookie("token")
  res.status(200)
    .json({
      message: "user logged out successfully"
    })
}

const getMe = async (req, res) => {
  const user = await UserModel.findById(req.user._id)
  res.status(200)
    .json({
      message: "user details fetched successfully",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar
      }
    })
}

/**
 * @description Update logged-in user's profile — username and/or avatar.
 * Dono fields optional hain, jo bheja jaye wahi update hoga.
 */
const updateProfile = async (req, res) => {
  const { username } = req.body

  const updateData = {}

  if (username) {
    updateData.username = username
  }

  if (req.file) {
    updateData.avatar = req.file.cloudinaryUrl
  }

  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({
      message: "Nothing to update"
    })
  }

  const updatedUser = await UserModel.findByIdAndUpdate(
    req.user._id,
    updateData,
    { new: true }
  )

  res.status(200).json({
    message: "Profile updated successfully",
    user: {
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      avatar: updatedUser.avatar
    }
  })
}

export { userRegister,
  loginUser,
  logOutUser,
  getMe,
  updateProfile
};