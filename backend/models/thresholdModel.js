import mongoose from 'mongoose';

const thresholdSchema = new mongoose.Schema({
    collectionName: { type: String, required: true },
    field: { type: String, required: true },
    green: { type: Number, required: true },
    amber: { type: Number, required: true },
    direction: { type: String, enum: ['lower', 'higher'], required: true },
}, { timestamps: true });

thresholdSchema.index({ collectionName: 1, field: 1 }, { unique: true });

export default mongoose.model('Threshold', thresholdSchema);