import exp from 'express'
import { register, authenticate } from '../services/authService.js'
import { ArticleModel } from "../models/ArticleModel.js"
import { verifyToken } from '../middleware/verifyToken.js'
import { Types } from 'mongoose'

export const authorApp = exp.Router()

//register author - public
authorApp.post('/users', async (req, res) => {
    //get the user obj from the req body
    let userObj = req.body
    //call the register function
    const newUserObj = await register({ ...userObj, role: "AUTHOR" })
    //role - make the backend/server to decide the role, dont allow the client to decide this........
    res.status(201).json({ message: "user created", payload: newUserObj })
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
authorApp.post('/articles', verifyToken("AUTHOR"), async (req, res) => {
    //get the article object
    let article = {
        ...req.body,
        author: req.user.userId
    }
    //create article document
    let artDoc = new ArticleModel(article)
    //save
    let createdArticle = await artDoc.save()
    //send res
    res.status(200).json({ message: "article added!", payload: createdArticle })
})
//read articles of author - protected
authorApp.get('/article', verifyToken("AUTHOR"), async (req, res) => {
    //get author id
    let authorId = req.user.userId;
    //read the articles
    let articlesList = await ArticleModel.find({
        author: new Types.ObjectId(authorId),
        isArticleActive: true
    }).populate("author", "firstName lastName email");
    //send res
    res.status(200).json({ message: "articles: ", payload: articlesList })
})

//edit article - protected, better to use patch
authorApp.put('/articles/:articleId', verifyToken("AUTHOR"), async (req, res) => {
    //get the modified article
    let aid = req.params.articleId
    let modifiedArticle = req.body
    //find the article
    let foundArticle = await ArticleModel.findOne({ _id: aid, author: modifiedArticle.author })
    if (!foundArticle) {
        return res.status(401).json({ message: "article not found!" })
    }
    //update the article
    let newArticle = await ArticleModel.findByIdAndUpdate(
        aid,
        { $set: { ...modifiedArticle } },
        { new: true }
    )
    //send the res
    res.status(201).json({ message: "article updated successfully!", payload: newArticle })
})

// authorApp.delete('/articles/:articleId/author/:aid',verifyToken,authorCheck,async (req,res) => {
//     //get the article id from the url
//     let artId = req.params.articleId
//     let authorId = req.params.aid
//     //find the article and update the isArticleActive field
//     let deletedArticle = await ArticleModel.findByIdAndUpdate(
//         {_id:artId,author:authorId},
//         {$set:{isArticleActive:false}},
//         {new:true}
//     )
//     //send res
//     res.status(200).json({message:"soft delete is performed!",payload:deletedArticle})
// })

//delete(soft delete) - protected
authorApp.patch('/articles/:articleId/author/:aid/status', verifyToken("AUTHOR"), async (req, res) => {
    //get the details from the body
    let artId = req.params.articleId
    let authorId = req.params.aid
    let { isArticleActive } = req.body
    //author should only modify their own articles
    if (req.user.role === "AUTHOR" && authorId !== req.user.userId) {
        return res.status(403).json({
            message: "Forbidden: you cannot modify someone else's article"
        })
    }
    //find the article
    let article = await ArticleModel.findById(artId)
    //if article not found
    if (!article) {
        return res.status(404).json({ message: "Article not found" })
    }
    //check if already the article's status is same
    if (article.isArticleActive === isArticleActive) {
        return res.status(400).json({
            message: `Article already ${isArticleActive ? "active" : "inactive"}`
        })
    }
    //change the status of the article
    article.isArticleActive = isArticleActive
    await article.save()
    //send res
    res.status(200).json({
        message: `Article ${isArticleActive ? "restored" : "deleted"}`,
        payload: article
    })
})

//sirs version
//delete(soft delete) article(Protected route)
authorApp.patch("/articles/:id/status", verifyToken("AUTHOR"), async (req, res) => {
    const { id } = req.params;
    const { isArticleActive } = req.body;
    // Find article
    const article = await ArticleModel.findById(id); //.populate("author");
    //console.log(article)
    if (!article) {
        return res.status(404).json({ message: "Article not found" });
    }

    //console.log(req.user.userId,article.author.toString())
    // AUTHOR can only modify their own articles
    if (req.user.role === "AUTHOR" &&
        article.author.toString() !== req.user.userId) {
        return res
            .status(403)
            .json({ message: "Forbidden. You can only modify your own articles" });
    }
    // Already in requested state
    if (article.isArticleActive === isArticleActive) {
        return res.status(400).json({
            message: `Article is already ${isArticleActive ? "active" : "deleted"}`,
        });
    }

    //update status
    article.isArticleActive = isArticleActive;
    await article.save();

    //send res
    res.status(200).json({
        message: `Article ${isArticleActive ? "restored" : "deleted"} successfully`,
        article,
    });
});