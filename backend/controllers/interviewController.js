import db from "../config/db.js";

// 1. ADD INTERVIEW
export const addInterview = async (req, res) => {
    try {
        const {
            user_id,
            candidate_name,
            email,
            phone,
            company,
            position,
            interview_date,
            interview_time,
            interviewer,
            mode,
            status
        } = req.body;

        const sql = `
            INSERT INTO interviews
            (user_id, candidate_name, email, phone, company, position,
            interview_date, interview_time, interviewer, mode, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            user_id,
            candidate_name,
            email,
            phone,
            company,
            position,
            interview_date,
            interview_time,
            interviewer,
            mode,
            status
        ];

        const [result] = await db.query(sql, values);

        res.status(201).json({
            message: "Interview added successfully!",
            id: result.insertId
        });
    } catch (error) {
        console.error("Add interview error:", error.message);
        res.status(500).json({
            message: "Failed to add interview."
        });
    }
};

// 2. GET INTERVIEWS
export const getInterviews = async (req, res) => {
    try {
        const { user_id } = req.params;

        const [interviews] = await db.query(
            "SELECT * FROM interviews WHERE user_id = ? ORDER BY interview_date DESC",
            [user_id]
        );

        res.json(interviews);
    } catch (error) {
        console.error("Get interviews error:", error.message);
        res.status(500).json({
            message: "Failed to fetch interviews."
        });
    }
};

// 3. UPDATE INTERVIEW
export const updateInterview = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            user_id,
            candidate_name,
            email,
            phone,
            company,
            position,
            interview_date,
            interview_time,
            interviewer,
            mode,
            status
        } = req.body;

        const sql = `
            UPDATE interviews
            SET candidate_name = ?, email = ?, phone = ?, company = ?,
                position = ?, interview_date = ?, interview_time = ?,
                interviewer = ?, mode = ?, status = ?
            WHERE id = ? AND user_id = ?
        `;

        const values = [
            candidate_name,
            email,
            phone,
            company,
            position,
            interview_date,
            interview_time,
            interviewer,
            mode,
            status,
            id,
            user_id
        ];

        const [result] = await db.query(sql, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Interview not found."
            });
        }

        res.json({
            message: "Interview updated successfully!"
        });
    } catch (error) {
        console.error("Update interview error:", error.message);
        res.status(500).json({
            message: "Failed to update interview."
        });
    }
};

// 4. DELETE INTERVIEW
export const deleteInterview = async (req, res) => {
    try {
        const { id } = req.params;
        const { user_id } = req.body;

        const [result] = await db.query(
            "DELETE FROM interviews WHERE id = ? AND user_id = ?",
            [id, user_id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Interview not found."
            });
        }

        res.json({
            message: "Interview deleted successfully!"
        });
    } catch (error) {
        console.error("Delete interview error:", error.message);
        res.status(500).json({
            message: "Failed to delete interview."
        });
    }
};

