var mongoose = require('mongoose');

var listingSchema = new mongoose.Schema({
  title: {type: String, default: '' },
  creatorID: {type: String, default: ''},
  tagline: {type: String, default: '' },
  dateCreated: {type: Date, default: new Date() },
  numConnected: {type: Number, default: 1}
});

module.exports = mongoose.model('Listing', listingSchema);