import exp from 'express'
import { authenticate, register } from '../services/authService.js'
import { verifyToken } from '../middleware/verifyToken.js'
import { adminCheck } from '../middleware/adminCheck.js'
import { ArticleModel } from '../models/ArticleModel.js'
import { UserTypeModel } from '../models/UserModel.js'

export const adminApp = exp.Router()

//authenticate
// adminApp.post('/authenticate', async (req, res) => {
//     //get admin cred object
//     let userCred = req.body
//     //call authenticate function
//     let { token, admin } = await authenticate(userCred)
//     //save the token as a httponly cookie
//     res.cookie("token", token, {
//         httpOnly: true,
//         secure: false,
//         sameSite: "lax"
//     })
//     //send the res
//     res.status(200).json({ message: "admin logged in!", payload: admin })
// })

// //read all articles(optional)
// adminApp.get("/articles/:adminId", verifyToken, adminCheck, async (req, res) => {
//     //get the admin id from the url params
//     let adminId = req.params.adminId;
//     //get the articles
//     let articlesList = await ArticleModel.find({ isArticleActive: true }).populate("comments.user", "firstName lastName")
//     //send the res
//     res.status(200).json({ message: "articles:", payload: articlesList })
// })

//block user roles
adminApp.put('/block/:uid/adminId/:adminId', verifyToken("ADMIN"), adminCheck, async (req, res) => {
    //get the user id and the admin id from the url
    let uid = req.params.uid
    let adminId = req.params.adminId
    //check if the user exists
    let user = await UserTypeModel.findById(uid)
    if(!user || user.role !== "USER"){
        return res.json({message:"user not found"})
    }
    //update the isActive field in the user
    let modifiedUser = await UserTypeModel.findByIdAndUpdate(
        uid,
        {$set:{isActive:false}},
        {new:true}
    )
    //send the res
    res.status(200).json({message:"user is blocked!"})
})
//unblock user roles
adminApp.put('/unblock/:uid/adminId/:adminId',verifyToken("ADMIN"),adminCheck,async (req,res) => {
    //get the user id and the admin id from the body
    let uid = req.params.uid
    let adminId = req.params.adminId
    //check if the user exists
    let user = await UserTypeModel.findById(uid)
    if(!user || user.role !== "USER"){
        return res.json({message:"user not found"})
    }
    //update the isActive field in the user
    let modifiedUser = await UserTypeModel.findByIdAndUpdate(
        uid,
        {$set:{isActive:true}},
        {new:true}
    )
    //send the res
    res.status(200).json({message:"user is unblocked!"})
})

// GET all users (excluding admins)
adminApp.get("/users/:adminId", verifyToken("ADMIN"), adminCheck, async (req, res) => {
    let usersList = await UserTypeModel.find({ role: { $in: ["USER", "AUTHOR"] } })
    res.status(200).json({ message: "users:", payload: usersList })
})

// GET all articles (active + inactive)
adminApp.get("/articles/:adminId", verifyToken("ADMIN"), adminCheck, async (req, res) => {
    let articlesList = await ArticleModel.find()   // removed the filter
        .populate("author", "firstName lastName")   // populate author field
        .populate("comments.user", "firstName lastName")
    res.status(200).json({ message: "articles:", payload: articlesList })
})

// Deactivate article
adminApp.put("/deactivate/:articleId/adminId/:adminId", verifyToken("ADMIN"), adminCheck, async (req, res) => {
    await ArticleModel.findByIdAndUpdate(req.params.articleId, { $set: { isArticleActive: false } })
    res.status(200).json({ message: "article deactivated!" })
})

// Activate article
adminApp.put("/activate/:articleId/adminId/:adminId", verifyToken("ADMIN"), adminCheck, async (req, res) => {
    await ArticleModel.findByIdAndUpdate(req.params.articleId, { $set: { isArticleActive: true } })
    res.status(200).json({ message: "article activated!" })
})