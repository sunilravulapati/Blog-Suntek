import jwt from "jsonwebtoken"
import { config } from "dotenv"
config()

export function verifyToken(req, res, next) {
    // read token from cookies
    const token = req.cookies.token
    console.log("token:", token)

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized request. Please login again"
        })
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decodedToken
        next()
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" })
    }
}
