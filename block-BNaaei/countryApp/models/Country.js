let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let countrySchema = new Schema({
  name: String,
  States: [{ type: mongoose.Types.ObjectId, ref: 'State' }],
  neighbouring_countires: [{ type: mongoose.Types.ObjectId, ref: 'Country' }],
  continent: String,
  population: Number,
  area: Number,
  ethnicity: [String],
});

let Country = mongoose.model('Country', countrySchema);

module.exports = Country;