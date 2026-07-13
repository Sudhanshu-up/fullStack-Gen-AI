import { Router } from "express"
import { getMe, loginUser,
    logOutUser,
    userRegister,
    updateProfile
} from "../controllers/user.controller.js"
import { authUser } from "../midllewares/auth.midllewares.js"
import uploadAvatar from "../midllewares/avatarUpload.middleware.js"
import uploadToCloudinary from "../midllewares/uploadToCloudinary.middleware.js"

const authRouter = Router()

authRouter.route("/register").post(uploadAvatar.single("avatar"), uploadToCloudinary, userRegister)

authRouter.route("/login").post(loginUser)

authRouter.route("/logout").post(logOutUser)

authRouter.route("/getme").get(authUser, getMe)

authRouter.route("/profile").put(authUser, uploadAvatar.single("avatar"), uploadToCloudinary, updateProfile)

export default authRouter