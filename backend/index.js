import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { db } from "./db.js";

import usersRoute from "./routes/users.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", usersRoute);

app.listen(process.env.PORT, () => {
  console.log(`EduBridge backend running on port ${process.env.PORT}`);
});

const [rows] = await db.query("SELECT 1");
console.log("MySQL connected:", rows);
