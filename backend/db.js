const mongoose = require('mongoose');
const mongoURI = "mongodb://127.0.0.1:27017/ero"


function connectToMongo() {
  mongoose.connect(mongoURI)
  .then(() => {
     console.log("Connected")
  }).catch((err) => {
    console.log("Error")
  });

}

module.exports = connectToMongo;