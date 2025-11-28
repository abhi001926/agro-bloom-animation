// backend/routes/soil.js
import express from "express";
import { getSoilData } from "../controllers/soilController.js";

const router = express.Router();

// Example: /api/soil?lat=28.6&lon=77.2&start=2023-01-01&end=2023-01-10
router.get("/", getSoilData);

export default router;
