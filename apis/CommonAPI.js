import exp from 'express'
import { authenticate } from '../services/authService.js'
import { UserTypeModel } from '../models/UserModel.js'
import { verifyToken } from '../middleware/verifyToken.js'
import {hash,compare} from 'bcryptjs'

export const commonApp = exp.Router()

commonApp.post('/login', async (req, res) => {
    //get user cred object
    let userCred = req.body
    //call authenticate function
    let { token, user } = await authenticate(userCred)
    //save the token as a httponly cookie
    res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })
    //send the res
    res.status(200).json({ message: "logged in successfully!", payload: user })
})

commonApp.get('/logout',async(req,res)=>{
    //clear the cookie named 'token'
    res.clearCookie('token', {
        httpOnly:true,
        secure:false,
        sameSite:"lax"
    })
    res.status(200).json({message:"logged out successfully"})
})

//changing the password - protected!
commonApp.put('/change-password', verifyToken, async(req, res) => {
    let {email, oldPassword, newPassword} = req.body
    //find if user exists
    let user = await UserTypeModel.findOne({email})
    if(!user){
        return res.status(401).json({message:"user not found!"})
    }
    // Compare plaintext old password with stored hash
    const isMatch = await compare(oldPassword, user.password)
    if(!isMatch){
        return res.status(401).json({message:"password not matched!"})
    }
    // Hash the new password
    const hashNewPassword = await hash(newPassword, 12)
    // Update the password
    let modifiedUser = await UserTypeModel.findOneAndUpdate(
        {email: email},
        {$set: {password: hashNewPassword}},
        {new: true}
    )
    //delete the old password
    //send the res
    res.status(200).json({message:"password is updated!"})
})