import mongoose from 'mongoose';

const displaySchema = new mongoose.Schema({
    displayName: { type: String, required: true },
    time: {type: Number, required: true},
    thresholdIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Threshold' }]
}, { timestamps: true });

export default mongoose.model('Display', displaySchema);