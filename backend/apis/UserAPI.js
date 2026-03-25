import exp from 'express'
import { register, authenticate } from '../services/authService.js'
import { verifyToken } from '../middleware/verifyToken.js'
import { userCheck } from '../middleware/userCheck.js'
import { UserTypeModel } from '../models/UserModel.js'
import { ArticleModel } from '../models/ArticleModel.js'
import { uploadToCloudinary } from '../config/cloudinaryUpload.js'
import { upload } from '../config/multer.js'
import cloudinary from '../config/cloudinary.js'

export const userApp = exp.Router()


//register user
userApp.post(
    "/users",
    upload.single("profileImage"),
    async (req, res, next) => {
        let cloudinaryResult;
        try {
            let userObj = req.body;

            //  Step 1: upload image to cloudinary from memoryStorage (if exists)
            if (req.file) {
                cloudinaryResult = await uploadToCloudinary(req.file.buffer);
            }
            // Step 2: call existing register()
            const newUserObj = await register({
                ...userObj,
                role: "USER",
                profileImageURL: cloudinaryResult?.secure_url,
            });

            res.status(201).json({
                message: "user created",
                payload: newUserObj,
            });
        } catch (err) {
            // Step 3: rollback 
            if (cloudinaryResult?.public_id) {
                await cloudinary.uploader.destroy(cloudinaryResult.public_id);
            }
            next(err); // send to your error middleware
        }

    }
);

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