import { Router } from "express";

import { getHybridSearch, getSearch, getSuggestions } from "../controllers/searchController.js";

const router = Router()

router
    .route('/')
    .get(getSearch)

router
    .route('/hybrid')
    .get(getHybridSearch)

router
    .route('/suggestion')
    .get(getSuggestions)
export default router