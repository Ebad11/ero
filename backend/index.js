const express = require('express')
const app = express()
const cors= require('cors')
const port = 5000
const connectToMongo= require('./db');
connectToMongo();
app.use(express.json());
app.use(cors());
app.use("/map", require("./routes/map/map"));
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
}) 
