const express = require('express')
const router = express.Router();
const apiKey="074ec762-7efe-439c-8d4f-aa7beefeebe7"
router.get('/api/getMap', async (req, res) => {
  
  const { latitude, longitude, carSpecs } = req.body;

  try {
    const data = await fetchChargingPoints(latitude, longitude);
    // const batteryLife = estimateBatteryLife(chargingPoints, carSpecs);
    const chargingPoints = data.map(point => ({
      address: point.AddressInfo.AddressLine1,
      latitude: point.AddressInfo.Latitude,
      longitude: point.AddressInfo.Longitude
    }));
    res.json({ chargingPoints});
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }

  });

  async function fetchChargingPoints(latitude, longitude) {
    // Fetch nearby charging points from Open Charge Map API
    // Construct URL based on latitude and longitude
    const url = `https://api.openchargemap.io/v3/poi/?output=json&latitude=${latitude}&longitude=${longitude}&distance=10&distanceunit=KM&countrycode=US&maxresults=10&compact=true&key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }
  
  

  module.exports=router;