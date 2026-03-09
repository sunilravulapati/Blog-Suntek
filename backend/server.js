//this is the entry point of the entire backend
import exp from 'express'
import { connect } from 'mongoose'
import { config } from 'dotenv'
import { userApp } from './apis/UserAPI.js'
import { authorApp } from './apis/AuthorAPI.js'
import cookieParser from 'cookie-parser'
import { commonApp } from './apis/CommonAPI.js'
import { adminApp } from './apis/AdminAPI.js'
import cors from 'cors'

config() //process.env

const app = exp()
//use cors middleware
app.use(cors({ origin: ['http:localhost:5173'] }))
app.use(exp.json())//body parser json
//add cookie parser middleware 
app.use(cookieParser())

//connect apis
app.use('/user-api', userApp)
app.use('/author-api', authorApp)
app.use('/admin-api', adminApp)
app.use('/common-api', commonApp)


//connect to db
const connectDB = async () => {
    try {
        await connect(process.env.DB_URL)
        console.log("DB connection success")
        //start http server
        app.listen(process.env.PORT, () => console.log("server started!"))
    } catch (err) {
        console.log("error occurred")
    }
}
connectDB()

// app.post('/logout',(req,res)=>{
//     //clear the cookie named 'token'
//     res.clearCookie('token', {
//         httpOnly:true,
//         secure:false,
//         sameSite:"lax"
//     })
//     res.status(200).json({message:"logged out successfully"})
// })

//dealing with invalid paths
app.use((req, res, next) => {
    return res.json({ message: `${req.url} is an invalid path` })
})

//error handling middleware
app.use((err, req, res, next) => {
    // Mongoose validation error
    if (err.name === "ValidationError") {
        return res.status(400).json({
            message: "Validation failed",
            errors: err.errors,
        });
    }
    // Invalid ObjectId
    if (err.name === "CastError") {
        return res.status(400).json({
            message: "Invalid ID format",
        });
    }
    // Duplicate key
    if (err.code === 11000) {
        return res.status(409).json({
            message: "Duplicate field value",
        });
    }
    res.status(500).json({
        message: "Internal Server Error",
    });
});