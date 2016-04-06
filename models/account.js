var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var profile = new Schema({
  username : String,
  local: {
    password :String,
    username :String,
    email : String
  },
  linkedin: {
    id:String,
    firstName: String,
    lastName :String,
    pictureUrl:String,
    emailAddress :String,
    linkedinProfile :String,
    country:String,
    headline:String,
    industry:String,
    currentShare:String,
    numConnections:String,
    summary:String,
    specialties:String
  },
  facebook :{
    id :String,
    username : String
  },
  twitter :{
    id :String,
    username : String
  },
  google :{
    id:String,
    token:String,
    name:String,
    email:String,
  }
});


module.exports = mongoose.model('hihozzu',profile);
