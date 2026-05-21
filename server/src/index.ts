import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});

import router from "./routes.js";

const app = express()

app.use(cors())
app.use(express.json())

app.use('/', router)

const PORT = 3000

app.listen(PORT, () => {
    console.log(`backend is running on port ${PORT}`)
})