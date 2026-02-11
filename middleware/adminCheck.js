import { UserTypeModel } from "../models/UserModel.js";


export const adminCheck = async (req, res,next) => {
    //get the admin details from the body
    let adminId = req.body?.adminId||req.params.adminId
    //check if admin exits
    let admin = await UserTypeModel.findById(adminId)
    //if author not found
    if (!admin) {
        return res.status(401).json({ message: "admin not found!" })
    }
    //if author is found but role is different
    if (admin.role !== "ADMIN") {
        return res.status(403).json({ message: "user is not an admin" })
    }
    next()
}