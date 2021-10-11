let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let stateSchema = new Schema({
  name: String,
  country: { type: mongoose.Types.ObjectId, ref: 'Country' },
  neighbouring_states: [{ type: mongoose.Types.ObjectId, ref: 'State' }],
  population: Number,
  area: Number,
});

let State = mongoose.model('State', stateSchema);

module.exports = State;