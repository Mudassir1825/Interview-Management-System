import express from "express";
import {
    getProfile,
    updateProfile,
    changePassword
} from "../controllers/settingsController.js";

const router = express.Router();

router.get("/profile/:id", getProfile);
router.put("/profile/:id", updateProfile);
router.put("/change-password/:id", changePassword);

export default router;

