const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    event_type: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        required: true
    },
    source_app_id: {
        type: String,
        required: true
    },
    data_payload: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    previous_hash: {
        type: String,
        default: null
    },
    hash: {
        type: String,
        required: true
    }
});

eventSchema.index({ event_type: 1 });
eventSchema.index({ timestamp: -1 });
eventSchema.index({ source_app_id: 1 });

const EventLogging = mongoose.model('EventLogging', eventSchema);

module.exports = EventLogging;
