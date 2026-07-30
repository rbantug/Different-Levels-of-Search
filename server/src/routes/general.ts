import { Router } from "express";

import { getHealth, getEmbeddingTest, getAllKeywords } from "../controllers/generalController.js";

const router = Router();

router.get("/health", getHealth);

router.get("/embedding-test", getEmbeddingTest);

router.get("/keywords", getAllKeywords)

export default router;
