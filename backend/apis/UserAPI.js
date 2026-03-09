import exp from 'express'
import { register, authenticate } from '../services/authService.js'
import { verifyToken } from '../middleware/verifyToken.js'
import { userCheck } from '../middleware/userCheck.js'
import { UserTypeModel } from '../models/UserModel.js'
import { ArticleModel } from '../models/ArticleModel.js'

export const userApp = exp.Router()


//register user
userApp.post('/users', async (req, res) => {
    //get the user obj from the req body
    let userObj = req.body
    //call the register function
    const newUserObj = await register({ ...userObj, role: "USER" })
    //role - make the backend/server to decide the role, dont allow the client to decide this........
    res.status(201).json({ message: "user created", payload: newUserObj })
})

//authenticate/login user
// userApp.post('/authenticate',async (req,res) => {
//     //get user cred object
//     let userCred = req.body
//     //call authenticate function
//     let {token,user} = await authenticate(userCred)
//     //save the token as a httponly cookie
//     res.cookie("token",token,{
//         httpOnly:true,
//         secure:false,
//         sameSite:"lax"
//     })
//     //send the res
//     res.status(200).json({message:"user logged in!",payload:user})
// })

//read all articles - protected route
userApp.get('/users', verifyToken("USER"), async (req, res) => {
    // //get the user id from the body
    // let uid = req.params.uid
    //get the articles
    let articlesList = await ArticleModel.find({ isArticleActive: true }).populate("comments.user", "firstName lastName")
    //send the res
    res.status(200).json({ message: "articles:", payload: articlesList })
})

//add comment to an article - protected route
userApp.put('/users', verifyToken("USER"), async (req, res) => {
    //get the user and article id
    let { userId, articleId, comments } = req.body
    //check user
    if (userId !== req.user.userId) {
        return res.status(403).json({ message: "Forbidden" })
    }
    //update the article's comment
    let updatedArticle = await ArticleModel.findOneAndUpdate(
        { _id: articleId, isArticleActive: true },
        { $push: { comments: { user: userId, comment: comments } } },
        { new: true, runValidators: true }
    ).populate("comments.user", "firstName")
    //if article not found
    if (!updatedArticle) {
        return res.status(404).json({ message: "article not found" })
    }
    //send the res
    res.status(200).json({ message: "added a comment", payload: updatedArticle })
})