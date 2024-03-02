const express = require('express')
const router = express.Router();

router.get('/api/getMap', async (req, res) => {
    const { latitude, longitude, radius } = req.body;
  
    try {
      const url = `https://api.openchargemap.io/v3/poi/?output=json&latitude=${latitude}&longitude=${longitude}&distance=${radius}&distanceunit=KM&countrycode=US&maxresults=10&compact=true`;
      const response = await fetch(url);
      const data = await response.json();
      res.json(data);
    } catch (error) {
    
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Error fetching data' });
    }
    // res.json({greet:"Hello"})
  });
  

  module.exports=router;