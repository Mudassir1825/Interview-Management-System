import db from "../config/db.js";
import bcrypt from "bcryptjs";

// 1. GET PROFILE
export const getProfile = async (req, res) => {
    try {
        const { id } = req.params;

        const [users] = await db.query(
            "SELECT id, fullname, email, phone FROM users WHERE id = ?",
            [id]
        );

        if (users.length === 0) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        res.json(users[0]);
    } catch (error) {
        console.error("Get profile error:", error.message);
        res.status(500).json({
            message: "Failed to fetch profile."
        });
    }
};

// 2. UPDATE PROFILE
export const updateProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const { fullname, email, phone } = req.body;

        if (!fullname || !email || !phone) {
            return res.status(400).json({
                message: "Please fill in all the fields."
            });
        }

        await db.query(
            "UPDATE users SET fullname = ?, email = ?, phone = ? WHERE id = ?",
            [fullname, email, phone, id]
        );

        res.json({
            message: "Profile updated successfully!"
        });
    } catch (error) {
        console.error("Update profile error:", error.message);

        if (error.code === "ER_DUP_ENTRY") {
            return res.status(400).json({
                message: "This email is already registered."
            });
        }

        res.status(500).json({
            message: "Failed to update profile."
        });
    }
};

// 3. CHANGE PASSWORD
export const changePassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                message: "Please enter both passwords."
            });
        }

        const [users] = await db.query(
            "SELECT password FROM users WHERE id = ?",
            [id]
        );

        if (users.length === 0) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        const passwordMatch = await bcrypt.compare(
            currentPassword,
            users[0].password
        );

        if (!passwordMatch) {
            return res.status(400).json({
                message: "Current password is incorrect."
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await db.query(
            "UPDATE users SET password = ? WHERE id = ?",
            [hashedPassword, id]
        );

        res.json({
            message: "Password changed successfully!"
        });
    } catch (error) {
        console.error("Change password error:", error.message);
        res.status(500).json({
            message: "Failed to change password."
        });
    }
};

