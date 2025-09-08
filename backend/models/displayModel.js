const mongoose = require('mongoose');

const displaySchema = new mongoose.Schema({
    displayName: {
        type: String,
        required: true,
        unique: true
    },
    time: {
        type: Number,
        required: true
    },
    thresholdIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Threshold'
    }]
});

const Display = mongoose.model('Display', displaySchema);

module.exports = Display;