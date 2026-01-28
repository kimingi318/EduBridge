import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { db } from "./db.js";

import attendanceRouter from "./routes/attendance.js";
import coursesRouter from "./routes/courses.js";
import departmentsRouter from "./routes/departments.js";
import facultiesRouter from "./routes/faculties.js";
import lecturersRouter from "./routes/lecturers.js";
import profileRouter from "./routes/profiles.js";
import sessionsRouter from "./routes/sessions.js";
import unitsRouter from "./routes/units.js";
import usersRoute from "./routes/users.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", usersRoute);
app.use("/api/faculties", facultiesRouter);
app.use("/api/departments", departmentsRouter);
app.use("/api/courses", coursesRouter);
app.use("/api/units", unitsRouter);
app.use("/api/lecturers", lecturersRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/attendance", attendanceRouter);
app.use("/api/profiles", profileRouter);

app.listen(process.env.PORT, () => {
  console.log(`EduBridge backend running on port ${process.env.PORT}`);
});

const [rows] = await db.query("SELECT 1");
console.log("MySQL connected:", rows);
