const mongoose = require('mongoose');

const screenSchema = new mongoose.Schema({
  screenName: { type: String, required: true, unique: true },
  screenNameToLower: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  displayName: { type: String, default: '' },
  screenUrl: { type: String, required: true }
})

const Screen = mongoose.model('Screen', screenSchema)


module.exports = Screen;