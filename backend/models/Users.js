const mongoose= require('mongoose');
const { Schema }= mongoose;
const UserSchema= new Schema({
       
       email:{
          type: String,
          required: true,
          unique: true
       },

       password:{
          type: String,
          required: true
       },

       car:
       {
        
       }


})

module.exports = mongoose.model('user', UserSchema);