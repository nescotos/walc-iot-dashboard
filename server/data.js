var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var dataSchema = new Schema({
  //Define fields and types
  clientId : {type: String, required: true},
  humidity : {type: Number},
  temperature: {type: Number},
  createdAt : {type: Date, default: Date.now, required: true}
});

// Export the model
module.exports = mongoose.model('Data', dataSchema);
