import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cropsRoutes from "./routes/crops.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("✅ Agro backend is running");
});

// Use crops routes
app.use("/api/crops", cropsRoutes);

app.listen(PORT, () => {
  console.log(`🌾 Agro backend running at http://localhost:${PORT}`);
});
