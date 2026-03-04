import { UserTypeModel } from "../models/UserModel.js"

export const authorCheck=async(req,res,next)=>{
    //get the author id
    let aid = req.params?.aid || req.body.author
    //verify author
    let author = await UserTypeModel.findById(aid)
    //if author not found
    if(!author){
        return res.status(401).json({message:"author not found!"})
    }
    //if author is found but role is different
    if(author.role!=="AUTHOR"){
        return res.status(403).json({message:"user is not an author"})
    }
    //if author is blocked
    if(!author.isActive){
        return res.status(403).json({message:"author is blocked. Please contact admin to make it unblocked!"})
    }
    //forward the req to next
    next()
}