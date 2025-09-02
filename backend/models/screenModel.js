import mongoose from 'mongoose'

const screenSchema = new mongoose.Schema({
  screenName: { type: String, required: true, unique: true },
  screenNameToLower: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  displayName: { type: String},
  screenUrl: { type: String, required: true }
})

const Screen = mongoose.model('Screen', screenSchema)

export default Screen