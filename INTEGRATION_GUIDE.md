# 🌾 Real Data Integration Guide

This guide shows you how to use real data from data.gov.in.

## ✅ READY TO USE - Your API is Already Configured!

Your backend is **already configured** with your data.gov.in credentials:
- **API Key**: `579b464db66ec23bdd00000143422fb1752f47de6649d5ec0dbdee64`
- **Resource ID**: `35985678-0d79-46b4-9ed6-6f13308a1d24`

### Quick Start (3 Steps)

**1. Navigate to Backend**
```bash
cd backend
```

**2. Install Dependencies** (first time only)
```bash
npm install
```

**3. Start the Server**
```bash
npm start
```

You should see:
```
🌾 Agro backend running at http://localhost:5000
```

**4. View Live Data**
- The Crop Prices page will now display real data from data.gov.in
- Select different commodities (Pepper, Rice, Coconut, etc.)
- Choose aggregation: Daily, Monthly, or Yearly
- Data is cached for 24 hours for better performance

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
