var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Message = new Schema({
  from : String,
  to : String,
  contain :String,
  date : Date
});


module.exports = mongoose.model('Message',Message);
