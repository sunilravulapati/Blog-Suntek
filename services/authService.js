import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { UserTypeModel } from '../models/UserModel.js'
import {config} from 'dotenv'

//register function
export const register = async (userObj) => {
    //create a userDocument
    const userDoc = new UserTypeModel(userObj)
    //run validators to avoid password trap
    await userDoc.validate()
    //hash the password and replace it
    userDoc.password = await bcrypt.hash(userDoc.password,12)
    //save
    const created = await userDoc.save()
    //convert the document to java script object
    const newUser = created.toObject()
    //remove the password
    delete newUser.password
    //return the user obj without password
    return newUser
}


//authenticate function
export const authenticate = async ({email,password,role}) => {
    //check the email and the role
    const user = await UserTypeModel.findOne({email,role})
    if(!user){
        const err = new Error("Invalid email or role")
        err.status = 401
        throw err
    }
    //if user is valid but is blocked by admin


    //compare the passwords
    const isMatch = await bcrypt.compare(password,user.password)
    if(!user){
        const err = new Error("Invalid password")
        err.status = 401
        throw err
    }
    //generate token
    const token = jwt.sign({userId:user._id,email:user.email,userRole:user.role},
        process.env.JWT_SECRET, 
        {expiresIn:"1h"}
    )
    //convert to plain js object
    const userObj = user.toObject()
    //remove the password
    delete userObj.password
    return {token,user:userObj}
}