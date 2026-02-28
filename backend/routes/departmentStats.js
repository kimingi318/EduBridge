import express from "express";
import { db } from "../db.js";
import { verifyFirebaseToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/stats", verifyFirebaseToken, async (req, res) => {
  try {
    // Get department_id from user's profile in database
    const [userRows] = await db.query(
      "SELECT department_id FROM profiles WHERE firebase_uid = ?",
      [req.user.uid],
    );

    if (userRows.length === 0 || !userRows[0].department_id) {
      return res.status(400).json({ error: "Department not found for user" });
    }

    const departmentId = userRows[0].department_id;

    const [[students]] = await db.query(
      "SELECT COUNT(*) as total FROM profiles WHERE level IN ('I','II','III','IV','V') AND department_id = ?",
      [departmentId],
    );

    const [[lecturers]] = await db.query(
      "SELECT COUNT(*) as total FROM profiles WHERE L_Id IS NOT NULL AND department_id = ?",
      [departmentId],
    );

    const [[courses]] = await db.query(
      "SELECT COUNT(*) as total FROM courses WHERE dept_id = ?",
      [departmentId],
    );

    res.json({
      students: students.total,
      lecturers: lecturers.total,
      courses: courses.total,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
