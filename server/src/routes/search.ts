import { Router } from "express";

import { getHybridSearch, getSearch } from "../controllers/searchController.js";

const router = Router()

router
    .route('/')
    .get(getSearch)

router
    .route('/hybrid')
    .get(getHybridSearch)

export default router