import express from "express";
import { getCropPrices } from "../controllers/cropsController.js";

const router = express.Router();

/**
 * Query params:
 *  - from (YYYY-MM-DD) optional
 *  - to   (YYYY-MM-DD) optional
 *  - agg  (daily|monthly|yearly) default=monthly
 *  - force (true|false) to bypass cache
 */
router.get("/:commodity", getCropPrices);

export default router;
