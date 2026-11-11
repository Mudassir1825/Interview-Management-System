import db from "../config/db.js";
import bcrypt from "bcryptjs";

// ========================================
// 01. SIGN UP
// ========================================

export const signup = async (req, res) => {
    try {
        const { fullname, email, phone, password } = req.body;

        if (!fullname || !email || !phone || !password) {
            return res.status(400).json({
                message: "Please fill in all the fields."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = `
            INSERT INTO users
            (fullname, email, phone, password)
            VALUES (?, ?, ?, ?)
        `;

        await db.query(sql, [fullname, email, phone, hashedPassword]);

        res.status(201).json({
            message: "Signup successful!"
        });
    } catch (err) {
        console.error("Signup error:", err.message);

        if (err.code === "ER_DUP_ENTRY") {
            return res.status(400).json({
                message: "An account with this email already exists."
            });
        }

        res.status(500).json({
            message: "Signup failed!"
        });
    }
};

// ========================================
// 02. LOGIN
// ========================================

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Please enter your email and password."
            });
        }

        const [users] = await db.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const user = users[0];
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        res.json({
            message: "Login successful!",
            user: {
                id: user.id,
                fullname: user.fullname,
                email: user.email,
                phone: user.phone
            }
        });
    } catch (err) {
        console.error("Login error:", err.message);

        res.status(500).json({
            message: "Login failed!"
        });
    }
};

// ========================================
// 03. FORGOT PASSWORD
// ========================================

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: "Please enter your email address."
            });
        }

        const [users] = await db.query(
            "SELECT id FROM users WHERE email = ?",
            [email]
        );

        if (users.length === 0) {
            return res.status(404).json({
                message: "No account found with this email address."
            });
        }

        res.json({
            message: "Email verified successfully!"
        });
    } catch (err) {
        console.error("Forgot password error:", err.message);

        res.status(500).json({
            message: "Failed to verify email."
        });
    }
};

// ========================================
// 04. RESET PASSWORD
// ========================================

export const resetPassword = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required."
            });
        }

        const [users] = await db.query(
            "SELECT id FROM users WHERE email = ?",
            [email]
        );

        if (users.length === 0) {
            return res.status(404).json({
                message: "No account found with this email address."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.query(
            "UPDATE users SET password = ? WHERE email = ?",
            [hashedPassword, email]
        );

        res.json({
            message: "Password reset successfully!"
        });
    } catch (err) {
        console.error("Reset password error:", err.message);

        res.status(500).json({
            message: "Failed to reset password."
        });
    }
};

