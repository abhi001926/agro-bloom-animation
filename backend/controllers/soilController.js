// backend/controllers/soilController.js
import axios from "axios";

export const getSoilData = async (req, res) => {
  try {
    const { lat, lon, start = "2020-01-01", end = "2020-12-31" } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({ error: "lat and lon are required" });
    }

    // NASA POWER endpoint
    const url = `https://power.larc.nasa.gov/api/temporal/daily/point?parameters=TSOIL1,TSOIL2&community=AG&longitude=${lon}&latitude=${lat}&start=${start.replace(/-/g,"")}&end=${end.replace(/-/g,"")}&format=JSON`;

    const { data } = await axios.get(url);

    if (!data?.properties?.parameter) {
      return res.status(500).json({ error: "No soil data found" });
    }

    // Extract soil temperature 0–10cm (TSOIL1) and 10–200cm (TSOIL2)
    const soil1 = data.properties.parameter.TSOIL1;
    const soil2 = data.properties.parameter.TSOIL2;

    res.json({
      location: { lat, lon },
      start,
      end,
      soilTemperatureTop10cm: soil1,
      soilTemperature10to200cm: soil2,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to fetch soil data" });
  }
};
