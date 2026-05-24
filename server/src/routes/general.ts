import { Router } from "express";

import { getHealth, getEmbeddingTest } from "../controllers/generalController.js";

const router = Router();

router.get("/health", getHealth);

router.get("/embedding-test", getEmbeddingTest);

export default router;
