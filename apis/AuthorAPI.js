import exp from 'express'
import { register,authenticate } from '../services/authService.js'
import {ArticleModel} from "../models/ArticleModel.js"
import { UserTypeModel } from '../models/UserModel.js'
import { authorCheck } from '../middleware/authorCheck.js'
import { verifyToken } from '../middleware/verifyToken.js'

export const authorApp = exp.Router()

//register author - public
authorApp.post('/users',async (req,res) => {
    //get the user obj from the req body
    let userObj = req.body
    //call the register function
    const newUserObj = await register({...userObj,role:"AUTHOR"})
    //role - make the backend/server to decide the role, dont allow the client to decide this........
    res.status(201).json({message:"user created",payload:newUserObj})
})

// //authenticate - public
// authorApp.post('/authenticate',async (req,res) => {
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
//     res.status(200).json({message:"author logged in!",payload:user})
// })

//create article - protected
authorApp.post('/articles',verifyToken,authorCheck,async(req,res)=>{
    //get the article object
    let article = req.body
    //create article document
    let artDoc = new ArticleModel(article)
    //save
    let createdArticle = await artDoc.save()
    //send res
    res.status(200).json({message:"article added!",payload:createdArticle})
})
//read articles of author - protected
authorApp.get('/article/:aid',verifyToken,authorCheck,async(req,res)=>{
    //get author id
    let authorId = req.params.aid;
    //read the articles
    let articlesList = await ArticleModel.find({author:authorId,isArticleActive:true}).populate("author","firstName lastName email")
    //send res
    res.status(200).json({message:"articles: ",payload:articlesList})
})

//edit article - protected
authorApp.put('/articles/:articleId',verifyToken,authorCheck,async (req,res) => {
    //get the modified article
    let aid = req.params.articleId
    let modifiedArticle = req.body
    //find the article
    let foundArticle = await ArticleModel.findOne({_id:aid,author:modifiedArticle.author})
    if(!foundArticle){
        return res.status(401).json({message:"article not found!"})
    }
    //update the article
    let newArticle = await ArticleModel.findByIdAndUpdate(
        aid,
        {$set:{...modifiedArticle}},
        {new:true}
    )
    //send the res
    res.status(201).json({message:"article updated successfully!",payload:newArticle})
})

//delete(soft delete) - protected
authorApp.delete('/articles/:articleId/author/:aid',verifyToken,authorCheck,async (req,res) => {
    //get the article id from the url
    let artId = req.params.articleId
    let authorId = req.params.aid
    //find the article and update the isArticleActive field
    let deletedArticle = await ArticleModel.findByIdAndUpdate(
        {_id:artId,author:authorId},
        {$set:{isArticleActive:false}},
        {new:true}
    )
    //send res
    res.status(200).json({message:"soft delete is performed!",payload:deletedArticle})
})
