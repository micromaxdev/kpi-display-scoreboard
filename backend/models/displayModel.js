import mongoose from 'mongoose';

const displaySchema = new mongoose.Schema({
    displayName: { type: String, required: true, unique: true },
    time: {type: Number, default: 30},
    thresholdIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Threshold' }]
}, { timestamps: true });

export default mongoose.model('Display', displaySchema);