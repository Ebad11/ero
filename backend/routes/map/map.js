const express = require('express')
const router = express.Router();

router.get('/api/getMap', async (req, res) => {
  
    res.json({greet:"Hello Worlds"})
  });
  

  module.exports=router;