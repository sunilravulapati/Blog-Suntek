import { UserTypeModel } from "../models/UserModel.js";

export const adminCheck = async (req, res, next) => {
    try { // You should always wrap async middleware in try/catch
        let adminId = req.body?.adminId || req.params.adminId
        let admin = await UserTypeModel.findById(adminId)

        if (!admin) {
            return res.status(401).json({ message: "admin not found!" })
        }
        if (admin.role !== "ADMIN") {
            return res.status(403).json({ message: "user is not an admin" })
        }
        next() 
    } catch (error) {
        // If an error happens here, the request hangs because next() is never called!
        res.status(500).json({ message: "Internal server error" })
    }
}