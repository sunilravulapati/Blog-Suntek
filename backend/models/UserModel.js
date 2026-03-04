import {Schema,model} from 'mongoose'

const userSchema = new Schema({
    firstName:{
        type:String,
        required:[true,"first name is required"]
    },
    lastName:{
        type:String
    },
    email:{
        type:String,
        required:[true,"email is required"],
        unique:[true,"email already exists"]
    },
    password:{
        type:String,
        required:[true,"password is required"]
    },
    profileImageURL:{
        type:String,
    },
    role:{
        type:String,
        required:[true,"{Value} is an invalid role"],
        enum:["AUTHOR","USER","ADMIN"]
    },
    isActive:{
        type:Boolean,
        default:true
    }
},{
    strict:"throw",
    timestamps:true,
    versionKey:false
})

//create model
export const UserTypeModel = model('blog-user',userSchema)