import { randomUUID } from "crypto";
import express from "express";
import { db } from "../db.js";
import { verifyFirebaseToken } from "../middleware/auth.js";
// import { field } from "firebase/firestore/pipelines";
// import { error } from "console";

const router = express.Router();

router.get("/me", verifyFirebaseToken, async (req, res) => {
  const [rows] = await db.query(
    "SELECT * FROM profiles WHERE firebase_uid = ?",
    [req.user.uid],
  );

  res.json(rows[0] || null);
});
router.get("/by-id/:createdBy", verifyFirebaseToken, async (req, res) => {
  const { createdBy } = req.params;
  const [rows] = await db.query("SELECT name FROM profiles WHERE id = ?", [
    createdBy,
  ]);

  res.json(rows[0] || null);
});

router.get("/:id", verifyFirebaseToken, async (req, res) => {
  const { id } = req.params;
  const [rows] = await db.query(
    "SELECT name, id,username,profile_image FROM profiles WHERE firebase_uid = ?",
    [id],
  );
  res.json(rows);
});

router.get(
  "/by-department/:department_Id",
  verifyFirebaseToken,
  async (req, res) => {
    const { department_Id } = req.params;
    const [rows] = await db.query(
      "SELECT name,id,L_Id FROM profiles WHERE department_id = ?",
      [department_Id],
    );
    res.json(rows);
  },
);

router.patch("/", verifyFirebaseToken, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;

    const fields = req.body;

    if (Object.keys(fields).length === 0) {
      return res.status(400).json({ error: "No fields provided" });
    }

    // Build dynamic SQL
    const updates = [];
    const values = [];

    for (const key in fields) {
      updates.push(`${key} = ?`);
      values.push(fields[key]);
    }

    values.push(firebaseUid);

    const query = `
      UPDATE profiles
      SET ${updates.join(", ")}
      WHERE firebase_uid = ?
    `;

    await db.query(query, values);

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/", verifyFirebaseToken, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;

    const [userRows] = await db.query(
      "SELECT id,role FROM  users WHERE firebase_uid= ?",
      [firebaseUid],
    );

    if (userRows.length === 0) {
      return res.status(404).json({ Error: "User not found" });
    }

    const user = userRows[0];
    const role = user.role;

    const {
      //compulsory
      name,
      phone,
      username,
      department_id,

      //Optional
      profileImage,

      //compulsory for student
      level,
      course_name,
      reg_no,
      course_id,

      //compulsory for Admins
      A_Id,
      department_name,

      //compulsory for Lecturer
      L_Id,
      courses,
    } = req.body;

    const roleRequirements = {
      Student: ["reg_no", "level", "course_name", "course_id"],
      Admin: ["A_Id", "department_name", "department_id"],
      Lecturer: ["L_Id", "courses"],
    };

    const requiredFields = roleRequirements[role] || [];

    for (let field of requiredFields) {
      if (!req.body[field]) {
        return res
          .status(400)
          .json({ error: `${field} is required for role ${role}` });
      }
    }

    const [existing] = await db.query(
      "SELECT id FROM profiles WHERE firebase_uid=?",
      [firebaseUid],
    );

    if (existing.length > 0) {
      return res
        .status(200)
        .json({ message: "Profile already exists. Use PATCH to update." });
    }

    await db.query(
      `INSERT INTO profiles
      (id,firebase_uid,name,phone,profile_image,level,course_name,reg_no,username,course_id,A_Id,department_name,department_id,
      L_Id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        randomUUID(),
        req.user.uid,
        name,
        phone,
        profileImage || null,
        level || null,
        course_name || null,
        reg_no || null,
        username,
        course_id || null,
        A_Id || null,
        department_name || null,
        department_id || null,
        L_Id || null,
      ],
    );

    if (role === "Lecturer") {
      if (!Array.isArray(courses) || courses.length === 0) {
        return res.status(400).json({
          error: "Lecturer must select at least one course",
        });
      }

      // ensure we have an array before filtering
      const selectedCoursesArray = Array.isArray(courses) ? courses : [];
      const mainCourses = selectedCoursesArray.filter(
        (c) => c.is_main === true,
      );
      if (mainCourses.length !== 1) {
        return res.status(400).json({
          error: "Exactly one main course must be selected",
        });
      }
      for (let course of selectedCoursesArray) {
        await db.query(
          `INSERT INTO  lecturer_courses
          (id,lecturer_id, course_id, is_main)
          VALUES (?,?,?,?)`,
          [
            randomUUID(),
            req.user.uid,
            course.course_id,
            course.is_main || false,
          ],
        );
      }
    }

    res.json({ sucess: true });
  } catch (error) {
    console.error("Error saving profile:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
