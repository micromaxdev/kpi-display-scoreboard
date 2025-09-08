const mongoose = require('mongoose');

const thresholdSchema = new mongoose.Schema({
    collectionName: { type: String, required: true },
    field: { type: String, required: true },
    green: { type: Number, required: true },
    amber: { type: Number, required: true },
    direction: { type: String, enum: ['lower', 'higher'], required: true },
    excludedFields: {
        type: [String],
        default: [],
        validate: {
            validator: function(fields) {
                return Array.isArray(fields) && fields.every(field => typeof field === 'string');
            },
            message: 'Excluded fields must be an array of strings'
        }
    }
}, { timestamps: true });

thresholdSchema.index({ collectionName: 1, field: 1 }, { unique: true });

module.exports = mongoose.model('Threshold', thresholdSchema);