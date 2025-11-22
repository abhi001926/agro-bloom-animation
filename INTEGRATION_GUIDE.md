# 🌾 Real Data Integration Guide

This guide shows you how to connect your app to real data from data.gov.in.

## ✅ What's Already Working: Crop Prices

The crop price data is **ready to use** with real data from data.gov.in!

### Setup Steps:

1. **Get your API key** from https://data.gov.in/
   - Create an account (it's free)
   - Get your API key from your account settings

2. **Add your API key:**
   - Go to `backend/.env.example`
   - Rename it to `backend/.env`
   - Replace `YOUR_API_KEY_HERE` with your actual API key:
   ```
   AGMARK_API_KEY=your-actual-api-key-here
   ```

3. **Start the backend:**
   ```bash
   cd backend
   npm install
   node server.js
   ```

4. **That's it!** The crop prices page will now show real live data.

### Available Commodities:
- Wheat, Rice, Onion, Potato, Tomato
- Maize, Soyabean, Cotton, Groundnut
- Turmeric, Pepper, Cardamom, Coconut

---

## ⚠️ Soil Data: Not Yet Available

Unfortunately, **data.gov.in does not provide a public API for soil data**.

### Current Status:
- The Soil Data page uses **realistic mock data** based on Kerala soil surveys
- Real soil data is available at https://soilhealth.dac.gov.in/ but only through their web interface
- There's no REST API endpoint to fetch this data programmatically

### When API Becomes Available:
We've prepared the structure in `src/services/soilDataService.ts`. When data.gov.in adds a soil data API:

1. Add the soil API key to `backend/.env`:
   ```
   SOIL_API_KEY=your-soil-api-key
   ```

2. Create a backend endpoint in `backend/server.js`:
   ```javascript
   app.get("/api/soil/:district", async (req, res) => {
     // Similar to crops endpoint
   });
   ```

3. Update `fetchSoilData()` function to use the real API

---

## 📊 Data Sources

### Crop Prices (Live):
- **Source:** AgMark API via data.gov.in
- **Resource ID:** 9ef84268-d588-465a-a308-a864a43d0070
- **Update Frequency:** Daily
- **Data:** Market arrival prices, modal prices, commodity trends

### Soil Data (Mock):
- **Source:** Kerala Agricultural University surveys (static data)
- **Why Mock?** No public API available yet
- **Accuracy:** Based on real soil characteristics per district
- **Districts:** Thiruvananthapuram, Ernakulam, Wayanad, Alappuzha, Palakkad

---

## 🔧 Troubleshooting

**Backend not connecting?**
- Make sure backend is running on port 5000
- Check that `.env` file exists with your API key
- Verify API key is valid at data.gov.in

**No crop data showing?**
- Check browser console for errors
- Verify the commodity name is correct
- Try a different commodity from the available list

**Need different aggregation?**
- Edit the service call to use: `"daily"`, `"monthly"`, or `"yearly"`

---

## 💡 Future Enhancements

When more APIs become available, you can easily add:
- Weather forecasting (already using tomorrow.io)
- Market demand predictions
- Crop disease detection
- Irrigation scheduling
- Fertilizer recommendations

All following the same pattern: just replace the API key!
