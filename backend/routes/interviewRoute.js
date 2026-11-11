import express from "express";
import {
    addInterview,
    getInterviews,
    updateInterview,
    deleteInterview
} from "../controllers/interviewController.js";

const router = express.Router();

router.post("/interviews", addInterview);
router.get("/interviews/:user_id", getInterviews);
router.put("/interviews/:id", updateInterview);
router.delete("/interviews/:id", deleteInterview);

export default router;

