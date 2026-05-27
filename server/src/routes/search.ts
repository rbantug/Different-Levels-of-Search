import { Router } from "express";

import { getSearch } from "../controllers/searchController.js";

const router = Router()

router
    .route('/')
    .get(getSearch)

export default router